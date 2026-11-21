const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open'); menu.setAttribute('aria-expanded','false');
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
  const option = [...select.options].find(o => o.text === enquiry);
  if (option) select.value = option.value;
  else if (/spare|part|chain|axle|brake|bolt|fitting/i.test(enquiry)) select.value = 'Spare parts and accessories';
  else if (/\bRC\b|radio control|monster truck|truggy/i.test(enquiry)) select.value = 'RC cars and hobbies';
  else if (/hoodie|t-shirt|polo|branded clothing/i.test(enquiry)) select.value = 'Essex Moto branded clothing';
  else if (/quad/i.test(enquiry)) select.value = /adult|commander/i.test(enquiry) ? 'Adult quad bikes' : "Kids' electric quad bikes";
  else if (/dirt bike|pit bike|motorcycle/i.test(enquiry)) select.value = /kids|junior/i.test(enquiry) ? "Kids' riding clothing" : 'Adult riding equipment';
  if (message) message.value = enquiry;
}));
document.getElementById('enquiry-form').addEventListener('submit', e => {
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
document.getElementById('year').textContent = new Date().getFullYear();

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
  // Supplier delivery £100 plus the agreed 2% uplift.
  const CUSTOMER_DELIVERY = 102;
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
        <p class="basket-note">Delivery is £102. Your card will be charged securely at checkout. Supplier fulfilment is confirmed after payment; if an item cannot be supplied, we will contact you and arrange a refund. Optional pre-assembly/PDI must be quoted for your exact model before checkout.</p>
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
      <article class="basket-line" data-line-id="${item.id}">
        <div class="basket-line-copy"><strong>${escapeHtml(item.name)}</strong><span>${money(item.price)} each</span></div>
        <div class="basket-line-actions">
          <button type="button" data-qty="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button type="button" data-qty="1" aria-label="Increase quantity">+</button>
          <button type="button" class="basket-remove" data-remove>Remove</button>
        </div>
        <strong class="basket-line-total">${money(item.price * item.qty)}</strong>
      </article>`).join('');
    const subtotal = basket.reduce((sum,item)=>sum+item.price*item.qty,0);
    totalEl.innerHTML = '<div><span>Product subtotal</span><strong>' + money(subtotal) + '</strong></div><div><span>Delivery</span><strong>' + money(CUSTOMER_DELIVERY) + '</strong></div><div class="basket-grand-total"><span>Total before any optional assembly</span><strong>' + money(subtotal + CUSTOMER_DELIVERY) + '</strong></div>';
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
    const stockText = card?.querySelector('.stock-label')?.textContent?.trim().toLowerCase() || '';
    const unavailable = stockText === 'out of stock' || stockText.includes('unavailable');
    if (unavailable) {
      button.textContent = 'Out of stock';
      button.disabled = true;
      button.setAttribute('aria-label', title + ' is out of stock');
      button.classList.add('button-disabled');
    } else {
      button.textContent = 'Add to basket';
      button.setAttribute('aria-label','Add ' + title + ' to basket');
      button.addEventListener('click', () => {
        if (!Number.isFinite(price)) {
          open();
          return;
        }
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g,'-');
        const existing = basket.find(item => item.id === id);
        if (existing) existing.qty += 1;
        else basket.push({id,name:title,price,qty:1});
        save();
        button.textContent = 'Added ✓';
        window.setTimeout(() => { button.textContent = 'Add to basket'; }, 1300);
      });
    }
    link.replaceWith(button);
  });

  panel.querySelector('#basket-lines').addEventListener('click', e => {
    const line = e.target.closest('[data-line-id]');
    if (!line) return;
    const item = basket.find(entry => entry.id === line.dataset.lineId);
    if (!item) return;
    if (e.target.hasAttribute('data-remove')) basket = basket.filter(entry => entry.id !== item.id);
    else if (e.target.hasAttribute('data-qty')) {
      item.qty += Number(e.target.dataset.qty);
      if (item.qty < 1) basket = basket.filter(entry => entry.id !== item.id);
    } else return;
    save();
  });

  panel.querySelector('#basket-enquiry-form').addEventListener('submit', async e => {
    e.preventDefault();
    if (!basket.length) return;
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
          items: basket.map(item => ({ id: item.id, qty: item.qty })),
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
