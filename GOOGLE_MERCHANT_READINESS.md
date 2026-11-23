# Essex Moto — Google Shopping / Merchant Center readiness
Reviewed: 23 November 2026. Status: **audit and preparation only; no products submitted or approved**.

## Current state (source audit)
- Site uses category pages (`index.html`, `riding-gear.html`, `spare-parts.html`), rather than individual product landing pages.
- `script.js` currently displays a flat **£102 delivery** in the basket for products, which needs checking for helmets, clothing and small spare parts before advertising any items.
- Product prices, stock labels and checkout totals must be confirmed as consistent at the time of publication. Many stock labels are subject to supplier confirmation.
- No complete, standalone delivery and returns policy links were found on the reviewed product category pages.
- Checkout and customer payment have not been tested end-to-end in this review.

## Priority: Google free listings for eligible gear and spare parts
Assess specific helmets, gloves, boots, protective clothing and suitable spare parts first. Do not submit motorised vehicles/ATVs into ordinary free Shopping listings without checking Google's restrictions; vehicle listings use different policies. Google may reject unsupported vehicle types.

### Products to check with supplier (website figures only, not live stock verification)
| Candidate | Site price | Site stock label |
| --- | ---: | --- |
| Wulfsport Kids Air-X Helmet – Pink | £49.95 | In Stock |
| Wulfsport Cub Racing Suit – Pink | £39.99 | In Stock |
| Wulfsport Kids Attack Gloves – Pink | £15.95 | In Stock |

Do not infer manufacturer GTIN/MPN, helmet size/certification, or exact availability from old page text.

## Required before Merchant Center submissions
1. Confirm supplier fulfilment, actual small-item delivery rates, VAT-inclusive prices, variants, product identifiers and buyer-facing returns handling. Correct any blanket shipping charge that does not reflect real order costs.
2. Create one permanent individual product URL per approved SKU, with its own image, H1/title, variant/size/description, accurate GBP price, real stock status, relevant safety specs, visible delivery/returns information and direct purchase path.
3. Publish accurate business, delivery and return policy information (including contact details and clear rights). Do not invent business details or promise policies not implemented.
4. Test add-to-basket, checkout and order/dispatch workflow from each landing page; ensure the item/price/shipping match page, feed, cart and final checkout.
5. Then add correct Product + Offer structured data, with a truthful availability value, verified price, image and canonical URL for each eligible product.
6. Verify/claim domain and configure shipping and returns in Merchant Center, then submit **only approved, verified products**. Review product diagnostics and free-listings status.

No feed has been submitted. This work is only a preparatory audit; Merchant Center admin access is still needed.

## Official Google references
- Free product listings: https://support.google.com/merchants/answer/13889434?hl=en-GB
- Landing page requirements: https://support.google.com/merchants/answer/4752265?hl=en-GB
- Product data specification: https://support.google.com/merchants/answer/7052112?hl=en-GB
- Unsupported Shopping content: https://support.google.com/merchants/answer/6150006?hl=en-GB
- Vehicle ads policy: https://support.google.com/merchants/answer/11544533?hl=en-GB
- Product structured data: https://developers.google.com/search/docs/appearance/structured-data/product
