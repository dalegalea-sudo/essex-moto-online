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
