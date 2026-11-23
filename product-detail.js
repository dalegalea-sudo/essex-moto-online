// Adds selected supplier-sourced riding gear directly to Essex Moto's existing basket.
// All prices and variant selections are revalidated by the Stripe checkout server.
(() => {
  "use strict";
  const form = document.getElementById("product-add-form");
  if (!form) return;
  const feedback = document.getElementById("product-basket-feedback");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = form.dataset.productId;
    const name = form.dataset.productName;
    const price = Number(form.dataset.productPrice);
    const size = form.elements.namedItem("size")?.value || "";
    if (!id || !name || !Number.isFinite(price) || price <= 0 || !size) {
      if (feedback) feedback.textContent = "Choose a size to add this product to your basket.";
      return;
    }
    const selector = form.elements.namedItem("size");
    if (!Array.from(selector.options).some(opt => opt.value === size && opt.value)) {
      if (feedback) feedback.textContent = "Choose a valid size before continuing.";
      return;
    }
    let basket;
    try {
      basket = JSON.parse(localStorage.getItem("essexMotoBasketV1") || "[]");
    } catch (_) {
      basket = [];
    }
    if (!Array.isArray(basket)) basket = [];
    const existing = basket.find(item => item.id === id && (item.size || "") === size);
    if (existing) {
      existing.qty = Math.min(5, existing.qty + 1);
    } else {
      basket.push({id, name, price, qty:1, size});
    }
    try {
      localStorage.setItem("essexMotoBasketV1", JSON.stringify(basket));
      window.location.assign("../riding-gear.html?basket=open#" + encodeURIComponent(id));
    } catch (_) {
      if (feedback) feedback.textContent = "Your basket could not be saved. Please use the riding-gear page to order.";
    }
  });
})();
