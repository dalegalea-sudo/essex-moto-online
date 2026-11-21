const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const Stripe = require("stripe");

const app = express();
const PORT = process.env.PORT || 10000;
const SITE_URL = (process.env.SITE_URL || "https://essex-moto-online.onrender.com").replace(/\/$/, "");
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || SITE_URL)
  .split(",").map((value) => value.trim()).filter(Boolean);
const ALLOWED_PRICE_IDS = new Set(
  (process.env.STRIPE_PRICE_IDS || "").split(",").map((value) => value.trim()).filter(Boolean)
);

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("Missing STRIPE_SECRET_KEY environment variable.");
  process.exit(1);
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.error("Missing STRIPE_WEBHOOK_SECRET environment variable.");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed"));
  }
}));

// Stripe requires the unparsed request body to verify webhook signatures.
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send("Invalid webhook signature");
  }

  if (event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      // The Stripe Dashboard remains the payment record. Supplier ordering is
      // deliberately manual: every paid order remains pending your approval.
      console.log("ESSEX_MOTO_PAID_ORDER", JSON.stringify({
        sessionId: session.id,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email || null,
        supplierOrderStatus: "PENDING_MANUAL_APPROVAL"
      }));
    }
  } else if (event.type === "checkout.session.async_payment_failed") {
    console.warn("ESSEX_MOTO_PAYMENT_FAILED", event.data.object.id);
  }

  res.json({ received: true });
});

app.use(express.json({ limit: "20kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "essex-moto-stripe-checkout" });
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { priceId, quantity = 1 } = req.body || {};
    if (typeof priceId !== "string" || !ALLOWED_PRICE_IDS.has(priceId)) {
      return res.status(400).json({ error: "This product is not currently enabled for online payment." });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
      return res.status(400).json({ error: "Quantity must be between 1 and 5." });
    }

    const price = await stripe.prices.retrieve(priceId);
    if (!price.active || !price.unit_amount || price.currency !== "gbp") {
      return res.status(400).json({ error: "This product price is unavailable." });
    }
    if (price.unit_amount * quantity > 40000) {
      return res.status(400).json({ error: "The order limit is £400." });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity }],
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["GB"] },
      phone_number_collection: { enabled: true },
      success_url: SITE_URL + "/?payment=success&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: SITE_URL + "/?payment=cancelled",
      metadata: { supplier_order_status: "PENDING_MANUAL_APPROVAL" }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session creation failed:", err.message);
    res.status(500).json({ error: "Unable to start checkout. Please try again or contact Essex Moto." });
  }
});

app.listen(PORT, () => {
  console.log(`Essex Moto Stripe checkout listening on port ${PORT}`);
});