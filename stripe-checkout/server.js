const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const Stripe = require("stripe");
const catalogue = require("./catalogue.json");

const app = express();
const PORT = process.env.PORT || 10000;
const SITE_URL = (process.env.SITE_URL || "https://essex-moto-online.onrender.com").replace(/\/$/, "");
// Always permit the verified Essex Moto storefront and Render preview in addition
// to explicitly configured origins. Never use wildcard CORS for checkout.
const ALLOWED_ORIGINS = [...new Set([
  SITE_URL,
  "https://essex-moto.co.uk",
  "https://www.essex-moto.co.uk",
  "https://essex-moto-online.onrender.com",
  ...(process.env.ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean)
])];
const PAYMENTS_ENABLED = process.env.PAYMENTS_ENABLED === "true";
const EXPECTED_MODE = process.env.CHECKOUT_EXPECTED_MODE || "test";
const LIVE_CHECKOUT_ALLOWED = process.env.ALLOW_LIVE_CHECKOUT === "true";
const key = (process.env.STRIPE_SECRET_KEY || "").trim();
const keyMode = key.startsWith("sk_live_") || key.startsWith("rk_live_") ? "live"
  : key.startsWith("sk_test_") || key.startsWith("rk_test_") ? "test" : "unknown";

if (!key) {
  console.error("Missing STRIPE_SECRET_KEY environment variable.");
  process.exit(1);
}
const stripe = new Stripe(key);
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed"));
  }
}));

// Stripe requires the exact, unparsed request body for webhook signature verification.
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).send("Webhook is not configured.");
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send("Invalid webhook signature");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("ESSEX_MOTO_ORDER_PAID", JSON.stringify({
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email || session.customer_email || null,
      shippingDetails: session.shipping_details || null,
      orderSummary: session.metadata?.order_summary || null,
      supplierOrderStatus: "PAYMENT_COLLECTED_FULFILMENT_PENDING"
    }));
  } else if (event.type === "payment_intent.amount_capturable_updated") {
    const intent = event.data.object;
    console.log("ESSEX_MOTO_CARD_AUTHORISED", JSON.stringify({
      paymentIntentId: intent.id,
      amountCapturable: intent.amount_capturable,
      currency: intent.currency,
      status: intent.status
    }));
  } else if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    console.log("ESSEX_MOTO_PAYMENT_CAPTURED", JSON.stringify({
      paymentIntentId: intent.id,
      amountReceived: intent.amount_received,
      currency: intent.currency,
      supplierOrderStatus: "PENDING_MANUAL_SUPPLIER_APPROVAL"
    }));
  } else if (event.type === "payment_intent.canceled") {
    console.log("ESSEX_MOTO_AUTHORIZATION_CANCELED", event.data.object.id);
  }

  res.json({ received: true });
});

app.use(express.json({ limit: "20kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "essex-moto-stripe-checkout" });
});

app.get("/api/payment-status", (_req, res) => {
  const modeMatches = keyMode === EXPECTED_MODE;
  const liveAllowed = keyMode !== "live" || LIVE_CHECKOUT_ALLOWED;
  res.json({
    service: "essex-moto-checkout",
    stripeKeyMode: keyMode,
    expectedMode: EXPECTED_MODE,
    paymentsEnabled: PAYMENTS_ENABLED && modeMatches && liveAllowed,
    checkoutType: "stripe-hosted",
    captureMode: "automatic",
    catalogueProducts: catalogue.products.length,
    deliveryPence: null, // tiered; final amount depends on basket contents
    deliveryBandsPence: catalogue.deliveryBandsPence,
    deliveryCalculation: catalogue.deliveryCalculation,
    webhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    livePaymentsEnabled: PAYMENTS_ENABLED && modeMatches && keyMode === "live" && LIVE_CHECKOUT_ALLOWED
  });
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    if (!PAYMENTS_ENABLED) return res.status(503).json({ error: "Online checkout is being prepared. Please contact Essex Moto." });
    if (keyMode !== EXPECTED_MODE) return res.status(503).json({ error: "Payment environment mismatch. Checkout is safely disabled." });
    if (keyMode === "live" && !LIVE_CHECKOUT_ALLOWED) return res.status(503).json({ error: "Live payments are not enabled." });
    if (!process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).json({ error: "Secure order confirmation is not configured yet." });

    const { items, customerName, email, postcode, assemblyRequested } = req.body || {};
    if (assemblyRequested) {
      return res.status(409).json({ error: "Pre-assembly/PDI must be quoted for your exact model first. Please contact Essex Moto before checkout." });
    }
    if (!Array.isArray(items) || items.length < 1 || items.length > 20) {
      return res.status(400).json({ error: "Your basket must contain between 1 and 20 different products." });
    }
    if (typeof customerName !== "string" || customerName.trim().length < 2 || customerName.length > 100) {
      return res.status(400).json({ error: "Please enter your name." });
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (typeof postcode !== "string" || postcode.trim().length < 5 || postcode.length > 12) {
      return res.status(400).json({ error: "Please enter a valid UK delivery postcode." });
    }

    const seen = new Set();
    const lineItems = [];
    const summary = [];
    let subtotal = 0;
    let bikeQuantity = 0;
    let parcelTier = null;
    for (const entry of items) {
      if (!entry || typeof entry.id !== "string" || !Number.isInteger(entry.qty) || entry.qty < 1 || entry.qty > 5) {
        return res.status(400).json({ error: "One or more basket items are invalid." });
      }
      const product = catalogue.products.find((p) => p.id === entry.id);
      if (!product || !product.available) {
        return res.status(409).json({ error: "A product in your basket is currently unavailable. Please refresh your basket." });
      }
      const size = typeof entry.size === "string" ? entry.size.trim() : "";
      const allowed = Array.isArray(product.sizeOptions) ? product.sizeOptions : [];
      if (allowed.length && !allowed.includes(size)) {
        return res.status(400).json({ error: "Please select an available size for " + product.name + " before checking out." });
      }
      if (!allowed.length && size) {
        return res.status(400).json({ error: "Size selection is not supported for " + product.name + "." });
      }
      const key = product.id + "|" + size;
      if (seen.has(key)) {
        return res.status(400).json({ error: "Your basket contains duplicate product-size entries." });
      }
      seen.add(key);
      const tier = product.shippingClass;
      if (!["bike", "medium", "small"].includes(tier)) {
        return res.status(409).json({ error: "Delivery category not set for a selected product. Contact Essex Moto before paying." });
      }
      if (tier === "bike") bikeQuantity += entry.qty;
      else if (tier === "medium") parcelTier = "medium";
      else if (!parcelTier) parcelTier = "small";
      const amount = product.unitAmount * entry.qty;
      subtotal += amount;
      lineItems.push({
        price_data: {
          currency: "gbp",
          unit_amount: product.unitAmount,
          product_data: { name: product.name + (size ? " — " + size : "") }
        },
        quantity: entry.qty
      });
      summary.push(product.id + (size ? "[" + size + "]" : "") + "x" + entry.qty);
    }

    const bands = catalogue.deliveryBandsPence;
    const delivery = bikeQuantity * bands.bike + (parcelTier ? bands[parcelTier] : 0);
    if (!Number.isInteger(delivery) || delivery < 0) {
      return res.status(503).json({ error: "Delivery price cannot be calculated. Please contact Essex Moto." });
    }
    if (subtotal + delivery > 500000) {
      return res.status(400).json({ error: "The maximum online order total is £5,000 including delivery. Please contact Essex Moto for larger orders." });
    }
    lineItems.push({
      price_data: {
        currency: "gbp",
        unit_amount: delivery,
        product_data: { name: "UK delivery – bikes and parcel items" }
      },
      quantity: 1
    });

    // Return shoppers to the storefront domain that actually initiated checkout.
    // This also works while the temporary Render URL is the canonical site.
    const requestedOrigin = req.headers.origin || "";
    const storefrontUrl = ALLOWED_ORIGINS.includes(requestedOrigin) ? requestedOrigin : SITE_URL;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: email.trim(),
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["GB"] },
      phone_number_collection: { enabled: true },
      payment_intent_data: {
        capture_method: "automatic",
        description: "Essex Moto order — payment collected at checkout; supplier fulfilment pending",
        metadata: {
          customer_name: customerName.trim(),
          delivery_postcode_entered: postcode.trim().toUpperCase(),
          supplier_order_status: "PAYMENT_COLLECTED_FULFILMENT_PENDING"
        }
      },
      success_url: storefrontUrl + "/?payment=paid&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: storefrontUrl + "/?payment=cancelled",
      client_reference_id: "EM-" + Date.now().toString(36).toUpperCase(),
      metadata: {
        customer_name: customerName.trim(),
        delivery_postcode_entered: postcode.trim().toUpperCase(),
        order_summary: summary.join(",").slice(0, 490),
        delivery_pence: String(delivery),
        supplier_order_status: "PENDING_STOCK_AND_PRICE_CONFIRMATION"
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session creation failed:", err.message);
    res.status(500).json({ error: "Unable to start secure checkout. Please try again or contact Essex Moto." });
  }
});

app.listen(PORT, () => {
  console.log("Essex Moto Stripe checkout listening on port " + PORT + " (key mode: " + keyMode + ")");
});
