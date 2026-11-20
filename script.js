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
