const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
  nav?.classList.remove('open'); menu?.setAttribute('aria-expanded','false');
}));
let activeCategory = 'all';
let activeSubcategory = 'all';
function applyFilters() {
  document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b.dataset.filter === activeCategory));
  document.querySelectorAll('.subfilter').forEach(b => b.classList.toggle('active', b.dataset.subfilter === activeSubcategory));
  document.querySelectorAll('.category-card').forEach(card => {
    card.hidden = activeSubcategory !== 'all' || (activeCategory !== 'all' && card.dataset.category !== activeCategory);
  });
  document.querySelectorAll('.product-card').forEach(card => {
    const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
    const subcategoryMatch = activeSubcategory === 'all' || card.dataset.subcategory === activeSubcategory || (activeSubcategory === 'parts' && card.dataset.category === 'parts');
    card.hidden = !(categoryMatch && subcategoryMatch);
  });
}
document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
  activeCategory = btn.dataset.filter;
  activeSubcategory = 'all';
  applyFilters();
}));
document.querySelectorAll('.subfilter').forEach(btn => btn.addEventListener('click', () => {
  activeSubcategory = btn.dataset.subfilter;
  activeCategory = 'all';
  applyFilters();
  document.getElementById('stock-heading').scrollIntoView({behavior:'smooth',block:'start'});
}));
document.querySelectorAll('[data-shop-subcategory]').forEach(link => link.addEventListener('click', () => {
  activeSubcategory = link.dataset.shopSubcategory;
  activeCategory = 'all';
  applyFilters();
}));
document.querySelectorAll('[data-enquiry]').forEach(link => link.addEventListener('click', () => {
  const select = document.querySelector('select[name="interest"]');
  const message = document.querySelector('textarea[name="message"]');
  const enquiry = link.dataset.enquiry || '';
  if (select) {
    const option = [...select.options].find(o => o.text === enquiry);
    if (option) select.value = option.value;
    else if (/spare|part|chain|axle|brake|bolt|fitting/i.test(enquiry)) select.value = 'Spare parts and accessories';
    else if (/\bRC\b|radio control|monster truck|truggy/i.test(enquiry)) select.value = 'RC cars and hobbies';
    else if (/quad/i.test(enquiry)) select.value = /adult|commander/i.test(enquiry) ? 'Adult quad bikes' : "Kids' electric quad bikes";
    else if (/dirt bike|pit bike|motorcycle/i.test(enquiry)) select.value = /kids|junior/i.test(enquiry) ? "Kids' riding clothing" : 'Adult riding equipment';
  }
  if (message) message.value = enquiry;
}));
const enquiryForm = document.getElementById('enquiry-form');
if (enquiryForm) enquiryForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const subject = encodeURIComponent('Essex Moto enquiry — ' + data.get('interest'));
  const body = encodeURIComponent(
    'Name: ' + data.get('name') + '\nEmail: ' + data.get('email') +
    '\nInterested in: ' + data.get('interest') + '\n\n' + data.get('message')
  );
  const businessEmail = e.currentTarget.dataset.businessEmail || 'info@essex-moto.co.uk';
  window.location.href = `mailto:${businessEmail}?subject=${subject}&body=${body}`;
});
const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();

// Essex Moto catalogue structure: keep every listed item in one of the five agreed ranges.
(() => {
  const removeUnrelated = () => {
    document.querySelectorAll('.nav a[href="#rc-hobbies"], #rc-hobbies').forEach(el => el.remove());
    document.querySelectorAll('select[name="interest"] option').forEach(option => {
      if (/\bRC cars|hobbies/i.test(option.text)) option.remove();
    });
    document.querySelectorAll('.product-card, .category-card, .package-card').forEach(card => {
      if (/\bbugg(?:y|ies)\b|go[- ]?karts?/i.test(card.textContent)) card.remove();
    });
    document.querySelectorAll('[data-enquiry]').forEach(link => {
      if (/\bRC\b|radio control|monster truck|truggy/i.test(link.dataset.enquiry || '')) link.remove();
    });
  };

  const categoryFor = card => {
    const sub = card.dataset.subcategory || '';
    const original = card.dataset.category || '';
    const text = card.textContent || '';
    if (original === 'parts' || /parts/.test(sub)) return 'parts';
    if (original === 'gear' || /gear|helmet|boots|clothing|bundle/.test(sub)) return 'clothing';
    if (sub === 'kids-electric-quads' || sub === 'kids-petrol-quads' || sub === 'adult-quads' || original === 'quads') return 'quads';
    if (sub === 'balance-bikes' || /kids|junior|child/i.test(text) && /dirt bike|off-road bike|balance bike/i.test(text)) return 'kids-motorbikes';
    if (original === 'dirt' || /dirt|pit bike|motorbike|motorcycle/i.test(text)) return 'dirt';
    return original || 'dirt';
  };

  const applyAgreedCategories = () => {
    removeUnrelated();

    document.querySelectorAll('.category-card[data-category], .product-card').forEach(card => {
      card.dataset.category = categoryFor(card);
    });

    const filters = document.querySelector('.filters');
    if (filters) {
      filters.setAttribute('aria-label', 'Filter Essex Moto product categories');
      filters.innerHTML = [
        ['all', 'All categories'],
        ['quads', 'Quad bikes'],
        ['kids-motorbikes', "Kids’ motorbikes"],
        ['dirt', 'Dirt bikes'],
        ['clothing', 'Clothing'],
        ['parts', 'Spare parts']
      ].map(([key, label], i) => '<button class="filter' + (i === 0 ? ' active' : '') + '" data-filter="' + key + '">' + label + '</button>').join('');
      filters.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
        const selected = button.dataset.filter;
        filters.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
        document.querySelectorAll('.category-card[data-category], .product-card').forEach(card => {
          card.hidden = selected !== 'all' && card.dataset.category !== selected;
        });
        const subfilters = document.querySelector('.subfilters');
        if (subfilters) subfilters.hidden = true;
      }));
    }

    const subfilters = document.querySelector('.subfilters');
    if (subfilters) subfilters.hidden = true;

    document.querySelectorAll('.category-card[data-category], .product-card').forEach(card => {
      card.hidden = false;
    });

    const parts = document.querySelector('#spare-parts');
    const partsHeading = parts && parts.querySelector('.stock-heading');
    if (partsHeading) partsHeading.setAttribute('aria-label', 'Essex Moto spare parts catalogue');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAgreedCategories, { once: true });
  } else {
    applyAgreedCategories();
  }
})();


// Essex Moto basket: local basket with multi-item enquiry (no payment is taken here).
(() => {
  const STORAGE_KEY = 'essexMotoBasketV1';
  // Essex Moto customer charges, not published Storm Buggies wholesale tariffs.
  // Charge per vehicle and one combined parcel tier for smaller products.
  const SHIPPING_RATES = Object.freeze({ small: 10, medium: 20, bike: 102 });
  const SIZE_OPTIONS_BY_ID = Object.freeze({"wulfsport-kids-air-x-helmet-pink":["Small – 48 cm","Medium – 50 cm","Large – 52 cm","XL – 54 cm"],"wulfsport-cub-racing-suit-pink":["XS – 3–4 years","S – 5–6 years","M – 7–8 years","L – 9–10 years","XL – 11–12 years"],"wulfsport-kids-attack-gloves-pink":["XXXS – 3–4 years","XXS – 5–7 years","XS – 8–12 years"]});
  const basketItemKey = item => item.id + "|" + (item.size || "");
  const SHIPPING_CLASS_BY_ID = Object.freeze({"renegade-ranger-1100w-48v-kids-quad-pink":"bike","renegade-ranger-1200w-48v-kids-quad-red":"bike","kids-800w-36v-electric-dirt-bike-10-10-pink":"bike","kids-1200w-48v-electric-dirt-bike-12-10-pink":"bike","2000w-60v-electric-dirt-bike-14-12-pink":"bike","wulfsport-kids-air-x-helmet-pink":"medium","wulfsport-cub-racing-suit-pink":"medium","wulfsport-kids-attack-gloves-pink":"small","apollo-mikro-rfz70-kids-petrol-quad":"bike","panther-110cc-kids-petrol-quad-black":"bike","sniper-pro-120cc-junior-quad-blue":"bike","sniper-pro-120cc-junior-quad-yellow":"bike","sniper-pro-120cc-junior-quad-grey":"bike","sniper-pro-120cc-junior-quad-multiple-colours":"bike","rfn-thunder-70cc-kids-automatic-pit-bike":"bike","rfn-thunder-pro-110cc-kids-semi-auto-pit-bike":"bike","rfn-thunder-140cc-xl-dirt-bike-19-16":"bike","storm-3000w-48v-electric-dirt-bike-14-12":"bike","storm-5000w-72v-electric-dirt-bike-17-14":"bike","thunder-250cc-adults-dirt-bike-21-18-xl":"bike","2026-wulfsport-adults-astral-helmet-blue":"medium","wulfsport-cub-youth-armoured-jacket":"medium","wulfsport-trackstar-adult-boots-black":"medium","blue-wulfsport-kids-helmet-clothing-bundle":"medium","wulfsport-cub-tech-kids-mx-goggles-black":"small","talaria-sting-l35-electric-dirt-bike-black-blue":"bike","talaria-x3-pro-electric-dirt-bike":"bike","talaria-sting-pro-l1e-13kw-electric-dirt-bike":"bike","talaria-komodo-l3e-32kw-electric-dirt-bike":"bike","kids-800w-36v-electric-dirt-bike-10-10-red":"bike","kids-1200w-48v-electric-dirt-bike-12-10-blue":"bike","2000w-60v-electric-dirt-bike-14-12-green":"bike","rfn-thunder-pro-fh-110cc-pit-bike-red-blue":"bike","apollo-commander-200-adults-quad-black":"bike","kids-800w-36v-electric-dirt-bike-10-10-blue":"bike","revvi-24-1500w-48v-kids-electric-off-road-bike-black":"bike","apollo-commander-200-adult-quad-bike-black":"bike","storm-2000w-60v-electric-dirt-bike-14-12-red":"bike","revvi-twelve-100w-kids-electric-balance-bike-black":"bike","revvi-twelve-100w-kids-electric-balance-bike-blue":"bike","revvi-18-500w-36v-kids-electric-bike-black":"bike","renegade-pro-1500w-60v-electric-quad-black":"bike","48v-15ah-lithium-battery-1200w-electric-dirt-bike":"medium","48v-brushless-controller-1200w-electric-dirt-bike":"small","48v-charger-1200w-electric-dirt-bike":"small","3-speed-key-switch-1200w-electric-dirt-bike":"small","1000w-electric-quad-headlamp-with-light":"small","1000w-electric-quad-front-brake-lever-cable":"small","1000w-electric-quad-handlebar":"medium","mudhead-drive-belt-725":"small","1-4-fuel-tap":"small","air-filter":"small","air-filter-breather-pipe":"small","connecting-rod-assembly":"small","cooling-fan-flywheel":"small","engine-gasket-set":"small","engine-output-shaft":"small","engine-output-shaft-bearing-crank":"small","connector":"small","fuse-reset-button-unit":"small","gts-150-complete-plastic-set-black":"medium","gts-150-complete-plastic-set-red":"medium","gts-150-complete-plastic-set-orange":"medium","150-gts-lower-hood":"medium","150-gts-owner-s-manual":"small","gts-150-side-arm-brush-bar":"medium","bolt-m6-12":"small","110cc-120cc-quad-carburettor":"small","front-brake-lever-rfn-rxf-rfz":"small","38mm-air-filter-assembly-sniper-pro-120cc":"small","110cc-quad-bike-piston-ring-set":"small","apollo-quad-bike-choke-cable":"small","apollo-120cc-125cc-quad-clutch-assembly":"small","apollo-quad-bike-sports-exhaust-system":"medium","front-brake-disc-thunder-250cc":"small","throttle-cable-thunder-250cc":"small","right-middle-side-cover-thunder-250cc":"small","front-fork-plastics-thunder-250cc":"small","wulfsport-kids-air-x-helmet-blue":"medium","wulfsport-kids-air-x-helmet-green":"medium","wulfsport-adults-astral-helmet-black":"medium","wulfsport-adults-attack-gloves-blue":"small","wulfsport-proban-racing-suit":"medium","wulfsport-super-boot-la":"medium","wulfsport-trackstar-boots-black":"medium","wulfsport-trackstar-boots-white":"medium","wulfsport-cub-max-kids-off-road-boots":"medium","wulfsport-cub-racing-camo-suit-blue":"medium","2026-wulfsport-warhammer-kids-race-shirt-blue":"small","wulfsport-cub-youth-protective-jacket":"medium","wulfsport-pro-series-adult-deflector":"medium","wulfsport-cub-hinged-kids-knee-pads":"small","wulfsport-cub-kids-elbow-pads":"small","wulfsport-cub-tech-mx-goggles-blue":"small","wulfsport-corsair-adults-race-shirt-blue":"small","wulfsport-matrix-adults-race-jacket-blue":"medium","wulfsport-waterproof-jacket-over-trousers-set":"medium","wulfsport-matrix-adults-race-jacket-orange":"medium","wulfsport-corsair-adults-race-shirt-pink-blue":"small","kids-1200w-48v-electric-dirt-bike-12-10-green":"bike","kids-1200w-48v-electric-dirt-bike-12-10-grey":"bike","kids-1200w-48v-electric-dirt-bike-12-10-yellow":"bike","kids-800w-36v-electric-dirt-bike-10-10-grey":"bike","2000w-60v-electric-dirt-bike-14-12-grey":"bike","2000w-60v-electric-dirt-bike-14-12-yellow":"bike","2000w-60v-electric-dirt-bike-14-12-blue":"bike","revvi-20-800w-36v-kids-electric-bike-green":"bike","talaria-sting-r-8kw-electric-dirt-bike-black-blue":"bike"});
  const deliveryForBasket = () => {
    let vehicles = 0;
    let parcelTier = null;
    basket.forEach(item => {
      const tier = SHIPPING_CLASS_BY_ID[item.id] || item.shippingClass || 'medium';
      if (tier === 'bike') vehicles += item.qty;
      else if (tier === 'medium') parcelTier = 'medium';
      else if (tier === 'small' && !parcelTier) parcelTier = 'small';
    });
    return { amount: vehicles * SHIPPING_RATES.bike + (parcelTier ? SHIPPING_RATES[parcelTier] : 0), vehicles, parcelTier };
  };
  let basket = [];
  try { basket = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (_) { basket = []; }
  if (!Array.isArray(basket)) basket = [];

  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(basket)); } catch (_) {}
    render();
  };
  const money = n => new Intl.NumberFormat('en-GB', { style:'currency', currency:'GBP' }).format(n);
  const panel = document.createElement('aside');
  panel.className = 'basket-panel';
  panel.id = 'basket-panel';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-modal','true');
  panel.setAttribute('aria-labelledby','basket-title');
  panel.hidden = true;
  panel.innerHTML = `
    <div class="basket-backdrop" data-basket-close></div>
    <div class="basket-sheet">
      <div class="basket-head"><div><p class="eyebrow">ESSEX MOTO</p><h2 id="basket-title">Your basket</h2></div><button class="basket-close" type="button" aria-label="Close basket" data-basket-close>×</button></div>
      <div id="basket-lines" class="basket-lines"></div>
      <div class="basket-total" id="basket-total"></div>
      <form id="basket-enquiry-form" class="basket-form">
        <p class="basket-note">Essex Moto delivery: £102 per bike; £20 for medium parcel items; £10 for small parcel items. One parcel fee applies to combined small/medium items (the higher tier applies). Your basket total includes delivery before payment. Supplier fulfilment is confirmed after payment; if an item cannot be supplied, we will contact you and arrange a refund. Optional pre-assembly/PDI must be quoted separately.</p>
        <label class="assembly-choice"><input name="assembly" type="checkbox" value="yes"> I would like pre-assembly/PDI if available for my selected model(s)</label>
        <label>Your name<input name="name" required autocomplete="name" placeholder="Your name"></label>
        <label>Email address<input name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label>
        <label>Delivery postcode<input name="postcode" required autocomplete="postal-code" placeholder="Postcode"></label>
        <button class="button button-blue" type="submit">Continue to secure checkout</button>
      </form>
      <p class="basket-empty-help">Card payments are collected at checkout. Supplier fulfilment is subject to availability; if an item cannot be supplied, we will contact you and arrange a refund. Pre-assembly/PDI is quoted separately where available.</p>
    </div>`;
  document.body.appendChild(panel);

  const countEl = document.getElementById('basket-count');
  const render = () => {
    const qty = basket.reduce((sum,item) => sum + item.qty, 0);
    if (countEl) countEl.textContent = String(qty);
    const lines = panel.querySelector('#basket-lines');
    const totalEl = panel.querySelector('#basket-total');
    if (!basket.length) {
      lines.innerHTML = '<p class="basket-empty">Your basket is empty. Add products from the shop to get started.</p>';
      totalEl.textContent = '';
      return;
    }
    lines.innerHTML = basket.map(item => `
      <article class="basket-line" data-line-key="${escapeHtml(basketItemKey(item))}">
        <div class="basket-line-copy"><strong>${escapeHtml(item.name)}</strong>${item.size ? '<span>Size: ' + escapeHtml(item.size) + '</span>' : ''}<span>${money(item.price)} each</span></div>
        <div class="basket-line-actions">
          <button type="button" data-qty="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button type="button" data-qty="1" aria-label="Increase quantity">+</button>
          <button type="button" class="basket-remove" data-remove>Remove</button>
        </div>
        <strong class="basket-line-total">${money(item.price * item.qty)}</strong>
      </article>`).join('');
    const subtotal = basket.reduce((sum,item)=>sum+item.price*item.qty,0);
    const delivery = deliveryForBasket();
    const detail = [delivery.vehicles ? delivery.vehicles + ' bike' + (delivery.vehicles === 1 ? '' : 's') : '', delivery.parcelTier ? delivery.parcelTier + ' parcel' : ''].filter(Boolean).join(' + ');
    totalEl.innerHTML = '<div><span>Product subtotal</span><strong>' + money(subtotal) + '</strong></div><div><span>Delivery' + (detail ? ' (' + detail + ')' : '') + '</span><strong>' + money(delivery.amount) + '</strong></div><div class="basket-grand-total"><span>Total before any optional assembly</span><strong>' + money(subtotal + delivery.amount) + '</strong></div>';
  };
  const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const open = () => { panel.hidden = false; document.body.classList.add('basket-open'); panel.querySelector('.basket-close').focus(); };
  const close = () => { panel.hidden = true; document.body.classList.remove('basket-open'); };
  document.getElementById('basket-toggle')?.addEventListener('click', open);
  panel.querySelectorAll('[data-basket-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });

  // Replace each enquiry-style Buy Now link with a real add-to-basket control.
  document.querySelectorAll('.product-card .buy-now-button').forEach(link => {
    const card = link.closest('.product-card');
    const title = card?.querySelector('h3')?.textContent?.trim() || link.dataset.enquiry || 'Essex Moto product';
    const priceText = card?.querySelector('.product-price')?.textContent || '';
    const match = priceText.replace(/,/g,'').match(/£\s*(\d+(?:\.\d{1,2})?)/);
    const price = match ? Number(match[1]) : NaN;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = link.className;
    const supplierStockStatus = {"panther-110cc-kids-petrol-quad-black":"Supplier listed: pre-order date passed — reconfirm before order","sniper-pro-120cc-junior-quad-blue":"Not confirmed","sniper-pro-120cc-junior-quad-yellow":"Not confirmed","sniper-pro-120cc-junior-quad-grey":"Not confirmed","sniper-pro-120cc-junior-quad-multiple-colours":"Not confirmed","storm-3000w-48v-electric-dirt-bike-14-12":"Supplier listed: pre-order date passed — reconfirm before order","storm-5000w-72v-electric-dirt-bike-17-14":"Supplier listed: pre-order date passed — reconfirm before order","blue-wulfsport-kids-helmet-clothing-bundle":"Supplier listed: in stock — reconfirm before order","kids-1200w-48v-electric-dirt-bike-12-10-blue":"Supplier listed: low on stock — reconfirm before order","revvi-18-500w-36v-kids-electric-bike-black":"Supplier listed: low on stock — reconfirm before order","air-filter-breather-pipe":"Supplier listed: low on stock — reconfirm before order","gts-150-side-arm-brush-bar":"Supplier listed: low on stock — reconfirm before order","wulfsport-waterproof-jacket-over-trousers-set":"Supplier listed: in stock — reconfirm before order","kids-1200w-48v-electric-dirt-bike-12-10-grey":"Supplier listed: low on stock — reconfirm before order","2000w-60v-electric-dirt-bike-14-12-grey":"Supplier listed: low on stock — reconfirm before order","2000w-60v-electric-dirt-bike-14-12-blue":"Supplier listed: low on stock — reconfirm before order","revvi-20-800w-36v-kids-electric-bike-green":"Supplier listed: low on stock — reconfirm before order","talaria-sting-r-8kw-electric-dirt-bike-black-blue":"Not confirmed"}
    // Use only confirmed in-stock catalogue items for direct basket checkout.
    // Supplier overrides cover low-stock, pre-order and unverified variants.
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let sizeSelect = null;
    const allowedSizes = SIZE_OPTIONS_BY_ID[id];
    if (allowedSizes?.length) {
      const label = document.createElement('label');
      label.textContent = 'Select size ';
      label.className = 'item-size-picker';
      label.style.display = 'block';
      label.style.margin = '10px 0';
      label.style.fontSize = '14px';
      sizeSelect = document.createElement('select');
      sizeSelect.setAttribute('aria-label', 'Choose size for ' + title);
      sizeSelect.required = true;
      sizeSelect.style.display = 'block';
      sizeSelect.style.padding = '9px 8px';
      sizeSelect.style.marginTop = '5px';
      sizeSelect.style.width = '100%';
      sizeSelect.style.background = '#fff';
      sizeSelect.style.color = '#111';
      sizeSelect.style.borderRadius = '6px';
      sizeSelect.appendChild(new Option('Choose a size', ''));
      allowedSizes.forEach(option => sizeSelect.appendChild(new Option(option, option)));
      label.appendChild(sizeSelect);
      link.before(label);
    }
    const stockLabel = card?.querySelector('.stock-label')?.textContent?.trim() || '';
    const unavailable = Boolean(supplierStockStatus[id]) || !/^in stock$/i.test(stockLabel);
    if (unavailable) {
      const status = supplierStockStatus[id] || (/out\s*of\s*stock/i.test(stockLabel) ? 'Out of Stock' : 'Not confirmed');
      const label = card?.querySelector('.stock-label');
      if (label) {
        label.textContent = status === 'Out of Stock' ? 'Out of stock' :
          status.startsWith('Supplier listed:') ? 'Supplier stock needs reconfirmation — please enquire' :
          'Availability not confirmed — please enquire';
      }
      button.textContent = status === 'Out of Stock' ? 'Out of stock' : 'Check availability';
      button.disabled = true;
      button.setAttribute('aria-label', title + ' is not currently available to purchase online');
      button.classList.add('button-disabled');
    } else {
      button.textContent = 'Add to basket';
      button.setAttribute('aria-label','Add ' + title + ' to basket');
      button.addEventListener('click', () => {
        if (!Number.isFinite(price)) {
          open();
          return;
        }
        const chosenSize = sizeSelect?.value || '';
        if (allowedSizes?.length && !allowedSizes.includes(chosenSize)) {
          alert('Please choose a size for ' + title + ' before adding it to your basket.');
          sizeSelect?.focus();
          return;
        }
        const existing = basket.find(item => item.id === id && (item.size || '') === chosenSize);
        if (existing) existing.qty += 1;
        else basket.push({id,name:title,price,qty:1,size:chosenSize});
        save();
        button.textContent = 'Added ✓';
        window.setTimeout(() => { button.textContent = 'Add to basket'; }, 1300);
      });
    }
    link.replaceWith(button);
  });

  panel.querySelector('#basket-lines').addEventListener('click', e => {
    const line = e.target.closest('[data-line-key]');
    if (!line) return;
    const item = basket.find(entry => basketItemKey(entry) === line.dataset.lineKey);
    if (!item) return;
    if (e.target.hasAttribute('data-remove')) basket = basket.filter(entry => basketItemKey(entry) !== basketItemKey(item));
    else if (e.target.hasAttribute('data-qty')) {
      item.qty += Number(e.target.dataset.qty);
      if (item.qty < 1) basket = basket.filter(entry => basketItemKey(entry) !== basketItemKey(item));
    } else return;
    save();
  });

  panel.querySelector('#basket-enquiry-form').addEventListener('submit', async e => {
    e.preventDefault();
    if (!basket.length) return;
    const missingSize = basket.find(item => SIZE_OPTIONS_BY_ID[item.id]?.length && !SIZE_OPTIONS_BY_ID[item.id].includes(item.size || ''));
    if (missingSize) {
      alert('Please remove and re-add ' + missingSize.name + ' and choose the required size before checkout.');
      open();
      return;
    }
    const form = new FormData(e.currentTarget);
    if (form.get('assembly') === 'yes') {
      alert('Pre-assembly/PDI has a model-specific supplier charge. Please contact Essex Moto on 07309 001841 for the exact quote before continuing to payment.');
      return;
    }
    const submit = e.currentTarget.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Connecting to secure checkout…';
    try {
      const response = await fetch('https://essex-moto-checkout.onrender.com/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: basket.map(item => ({ id: item.id, qty: item.qty, size: item.size || '' })),
          customerName: form.get('name'),
          email: form.get('email'),
          postcode: form.get('postcode'),
          assemblyRequested: false
        })
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || 'Secure checkout is not available yet.');
      window.location.href = result.url;
    } catch (error) {
      alert(error.message || 'Unable to start checkout. Please try again or contact Essex Moto.');
      submit.disabled = false;
      submit.textContent = 'Continue to secure checkout';
    }
  });
  render();
})();
