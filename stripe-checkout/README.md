# Essex Moto Stripe checkout service

This is a separate Node.js web service. It does not change the existing static website.

## Render service settings

Create a new **Web Service** from the existing GitHub repository:
- Branch: `main`
- Root Directory: `stripe-checkout`
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`

Add these environment variables in Render (never commit secrets to GitHub):
- `STRIPE_SECRET_KEY`: the Essex Moto **test-mode** secret key, entered directly in Render.
- `STRIPE_WEBHOOK_SECRET`: the signing secret shown when adding the webhook endpoint in Stripe.
- `SITE_URL`: `https://essex-moto-online.onrender.com`
- `ALLOWED_ORIGINS`: `https://essex-moto-online.onrender.com` (add the final custom domain later if used).
- `STRIPE_PRICE_IDS`: comma-separated Stripe Price IDs for products whose complete customer price, including any delivery charge, has been checked and approved.

## Stripe webhook

After the service is deployed, add a Stripe webhook endpoint:
`https://YOUR-NEW-RENDER-SERVICE.onrender.com/api/stripe/webhook`

Subscribe to:
- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`

Copy the webhook signing secret into Render as `STRIPE_WEBHOOK_SECRET`.

## Checkout API

POST `/api/create-checkout-session` with JSON:
`{"priceId":"price_...","quantity":1}`

Only Price IDs in `STRIPE_PRICE_IDS` are accepted. Prices are retrieved from Stripe server-side; client-submitted amounts are never trusted. GBP orders are limited to £5,000. VAT/tax is not added by this service.

## Important operating rules

- Use test-mode keys and test Price IDs until the complete flow has been tested.
- Only add a Price ID after confirming the correct product, supplier retail price and customer delivery charge. Do not invent prices.
- A successful payment is recorded in Stripe. Supplier ordering is **not automatic**; every paid order must remain pending the owner's manual approval.
- This starter service does not yet provide a persistent order-management database or connect checkout buttons to the storefront. Those are separate steps before taking real customer payments.
