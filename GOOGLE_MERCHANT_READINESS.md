# Essex Moto — Google Shopping / Merchant Center readiness
Updated 23 November 2026. Shipping tiers, UK returns page and three Wulfsport size selectors completed that evening. **Not submitted to Merchant Center; no Google free-listing approval is implied.**

## Verified matches from existing Essex Moto listings to published Storm Buggies pages
Three Wulfsport listings already on the Essex Moto riding-gear page now have their own product-information URLs on the Essex Moto domain. Their website prices match Storm Buggies' public prices at the time of review.

| Existing Essex Moto product | Essex Moto page | Storm Buggies page | Supplier reference | Public price | Supplier listing |
| --- | --- | --- | --- | ---: | --- |
| Wulfsport Kids Air-X Helmet – Pink | [Product details](https://essex-moto.co.uk/products/wulfsport-kids-air-x-helmet-pink.html) | [Supplier](https://www.stormbuggies.com/products/wulfsport-kids-air-x-helmet-pink-new-2025) | `wulf-jun-air-x-hel-pink` | £49.95 | In Stock |
| Wulfsport Cub Racing Suit – Pink | [Product details](https://essex-moto.co.uk/products/wulfsport-cub-racing-suit-pink.html) | [Supplier](https://www.stormbuggies.com/products/wulfsport-cub-racing-suit-pink) | `cubracingsuit-pink` | £39.99 | In Stock |
| Wulfsport Kids Attack Gloves – Pink | [Product details](https://essex-moto.co.uk/products/wulfsport-kids-attack-gloves-pink.html) | [Supplier category](https://www.stormbuggies.com/pretty-in-pink) | Not verified | £15.95 | In Stock |

These are supplier **public listing statuses**, not a real-time warehouse or variant-level inventory guarantee. The helmet supplier listing shows S 48 cm, M 50 cm, L 52 cm, and XL 54 cm; the racing suit listing shows XS approximately 3–4 years to XL approximately 11–12 years. Check exact sizes against the buyer's measurements.

Machine-readable preparation: [supplier-matched-gear.json](google-merchant/supplier-matched-gear.json). Its supplier product reference codes are **not presumed to be official manufacturer MPNs or GTINs**. Google requires accurate product identifiers where applicable.

## What was updated on the site
- Three dedicated SEO product information pages with visible names, images, GBP prices, concise specifications and size information.
- Links from the existing `riding-gear.html` product cards to those new pages.
- Three URLs in the XML sitemap (`sitemap.xml`), allowing Google Search to discover them.
- The pages describe supplier status conservatively and are **not yet suitable for submitting as Merchant Center paid/free listings**.

## Still preventing a compliant Merchant Center product feed
1. **Shipping**: Essex Moto has now implemented its own customer shipping tiers: **£10 for small parcel baskets**, **£20 when any medium-sized parcel item is included**, and **£102 per bike** (plus one parcel-tier charge for any additional parcel items). The frontend and Stripe backend use the same catalogue classifications, with 43 bikes, 28 medium and 37 small products. [Customer delivery policy](https://essex-moto.co.uk/delivery.html). **Storm Buggies does not publish these fixed amounts as supplier charges**; its product pages have a postcode-based 'Check Delivery Price' calculator. Confirm wholesale/postcode cost impacts before submitting the rates to Merchant Center.
2. **Size selection**: the helmet, pink racing suit and pink gloves now have required size selectors. The selected size is saved in Essex Moto's basket, validated by the Stripe backend and included in the Stripe line item's name and order summary. Helmet sizes and suit sizes come from Storm Buggies. Glove size choices (XXXS, XXS, XS) are from a different retailer of the matching Wulfsport product, and **Storm has not confirmed stock per size**. Other size-dependent clothing lines still require variant mapping and validation before advertising in Google.
3. **Returns**: [Essex Moto's customer cancellation and returns page](https://essex-moto.co.uk/returns.html) is published and linked throughout the site, reflecting UK consumer rights rather than copying Storm Buggies' restrictive direct-customer language. Before Merchant Center acceptance, add the seller's confirmed geographic business address, arrange appropriate return addresses, and disclose an actual or reasonable estimate of the cost to return bulky bikes that cannot be sent by ordinary post. Do not invent those details. See [GOV.UK](https://www.gov.uk/accepting-returns-and-giving-refunds).
4. **Stock / identifiers**: reconfirm current stock per size before publication; verify whether manufacturer GTIN/MPN exists. Do not treat Storm's site-specific product code as a verified manufacturer identifier.
5. **Merchant account and checkout**: confirm legal trading name, geographic business address, customer service details, carrier delivery speeds and any product-size restrictions. Connect, verify and claim `essex-moto.co.uk` in Merchant Center, configure shipping and returns, test a complete checkout including exact sizes, then submit a feed. Account access to perform this step is not available through the current ChatGPT connection. Google's shipping settings and landing-page prices must match customer checkout.
6. **Eligibility**: start with eligible safety gear and spare parts; avoid submitting quad bikes and dirt bikes to ordinary free Shopping listings until their product-type restrictions are resolved.


## Updates made after this audit
- [Returns and cancellations page](https://essex-moto.co.uk/returns.html) published with statutory refund/cancellation baseline and linked in shop footers, selected product pages and the basket; XML sitemap updated.
- [Delivery page](https://essex-moto.co.uk/delivery.html) retains Essex Moto customer rates: £102 per bike, £20 medium parcel, £10 small parcel. Storm Buggies calculates supplier delivery dynamically by postcode; the actual supplier cost is still **not verified**, so a genuine postcode/trade quote is required before making margin assumptions.
- Pink Wulfsport helmet, suit and gloves now require a customer size selection; backend checks variants and records each size separately in the Stripe order.
- Size-specific supplier stock is **not confirmed**. Do not publish Google ads/free Shopping listings as in-stock variants until confirmed.
- Both website and checkout Render deployments should be checked following their latest GitHub commits; deployment alone is not proof of successful payment or Merchant Center compliance.

## Official reference material
- [Google free listings](https://support.google.com/merchants/answer/13889434?hl=en-GB)
- [Product landing page requirements](https://support.google.com/merchants/answer/4752265?hl=en-GB)
- [Google product data specification](https://support.google.com/merchants/answer/7052112?hl=en-GB)
- [Google product identifiers](https://support.google.com/merchants/answer/160161?hl=en-GB)
- [Google unsupported Shopping content](https://support.google.com/merchants/answer/6150006?hl=en-GB)
- [UK online returns and refunds](https://www.gov.uk/accepting-returns-and-giving-refunds)

**No products were sent to Google, no emails were sent and no payments were initiated.**
