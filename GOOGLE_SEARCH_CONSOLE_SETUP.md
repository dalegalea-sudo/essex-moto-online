# Essex Moto — Google Search Console setup (temporary Render storefront)
Updated 23 November 2026.

## Current Search-facing configuration
- **Temporary storefront / canonical host:** https://essex-moto-online.onrender.com/
- **XML sitemap:** https://essex-moto-online.onrender.com/sitemap.xml
- **robots.txt:** https://essex-moto-online.onrender.com/robots.txt
- The sitemap has **13 distinct URLs**, each with a matching canonical URL on the Render host, including the new adult and kids bike category pages.
- All 13 pages include a 23 November 2026 sitemap modification date.
- The main homepage already contains a Google Search Console HTML meta-verification tag. The tag only verifies the **Google account that owns the token**; a new owner's verification token may differ.
- Render reports this website as **deployed**. External HTTP crawling and live Google indexing were **not** independently verified by this audit.

## Required actions in Google Search Console
1. Visit https://search.google.com/search-console/welcome and sign into the Google account managing Essex Moto.
2. Select the property menu. If `https://essex-moto-online.onrender.com/` is not shown, select **Add property** -> **URL prefix**, enter exactly `https://essex-moto-online.onrender.com/`, and complete verification.
3. Try HTML tag verification first. If Google provides a **different** verification tag from the one already on the homepage, the new token must be placed in `index.html` before choosing Verify. Do not remove any existing verified token without confirming its owner.
4. For the **Render URL-prefix property**, open **Indexing -> Sitemaps**. Enter `sitemap.xml` and click **Submit**. If Google already has it, check the last read date and submitted status; re-submit if it needs refreshing.
5. Under **URL inspection**, inspect `https://essex-moto-online.onrender.com/` and these newly created adult/kids pages first:
    - https://essex-moto-online.onrender.com/kids-bikes.html
    - https://essex-moto-online.onrender.com/adult-bikes.html
    Then inspect these three riding-gear product pages. Use **Test live URL**; only request indexing if the live test succeeds:
    - https://essex-moto-online.onrender.com/products/wulfsport-kids-air-x-helmet-pink.html
    - https://essex-moto-online.onrender.com/products/wulfsport-cub-racing-suit-pink.html
    - https://essex-moto-online.onrender.com/products/wulfsport-kids-attack-gloves-pink.html
6. In **Page indexing**, resolve reported crawl, duplicate/canonical, soft 404 or `noindex` warnings. Google crawling, ranking and indexing are not guaranteed and may take days.
7. When `essex-moto.co.uk` is fully working again, plan a controlled migration back to that custom domain. Verify both properties and update all canonical URLs, sitemap, structured data, checkout redirects and Merchant Center links together. Configure permanent redirects where supported, rather than leaving two independent competing versions of the shop.


## Kids' and adult bike organic Google Search pages
- [Kids' bikes and quads](https://essex-moto-online.onrender.com/kids-bikes.html): 24 specifically identified kids' vehicles, using Essex Moto's existing product prices and photos.
- [Adult dirt bikes and quads](https://essex-moto-online.onrender.com/adult-bikes.html): eight distinct adult models, including Talaria, adult dirt bikes and ATVs. A duplicate Apollo Commander card was removed from this search page; the shop catalogue was not changed.
- Ten bike models whose age suitability is not explicit remain on the general [dirt-bikes page](https://essex-moto-online.onrender.com/dirt-bikes.html), rather than being labelled as either adult or children's without evidence.
- These pages are meant for **organic Google Search**, not an assertion that off-road bikes qualify for Google Shopping/free Merchant Center listings. See Google vehicle policies before attempting feeds.

## Free Google Shopping / Merchant Center
Merchant Center is separate from Search Console. There is **no connected Merchant Center account** available to this session, and **no product feed has been submitted**.
- Start at https://merchants.google.com/ and choose **Free listings**, not paid campaigns.
- Confirm the legal trading name, real/authorised business address, seller contact details, order handling and returns information.
- Confirm supplier stock by size, GTIN/MPN where applicable, transit/handling time estimates, large-item returns and true shipping rates.
- Test a successful secure checkout end to end in the correct Essex Moto Stripe account.
- Only then create a data source with verified eligible products. Do not upload candidate JSON documents or imply `in_stock` when supplier variants have not been confirmed.

## Online-only local listing caution
An online-only retailer that does not meet customers in person is **generally not eligible for a Google Business Profile**. Focus on Search Console and Merchant Center rather than submitting an ineligible storefront/service-area listing. See https://support.google.com/business/answer/7039811?hl=en-GB .

## Official guides
- https://support.google.com/webmasters/answer/34592?hl=en
- https://support.google.com/webmasters/answer/7451001?hl=en-GB
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://support.google.com/merchants/answer/13889434?hl=en-GB
- https://support.google.com/merchants/answer/9158778?hl=en-GB

No emails sent, Google account actions performed, product feed submitted or money spent.
