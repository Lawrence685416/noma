document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.querySelector("#cart-items");
  if (!cartItemsContainer) return;

  const subtotalElement = document.querySelector("#cart-subtotal");
  const totalElement = document.querySelector("#cart-total");
  const itemCountElement = document.querySelector("#cart-item-count");
  const cartPage = document.querySelector(".cart-page");
  const emptyCart = document.querySelector("#empty-cart");
  const orderSummary = document.querySelector("#order-summary");

  function renderCart() {
    const cart = getCart();
    cartItemsContainer.innerHTML = "";

    const totalQuantity = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    if (itemCountElement) itemCountElement.textContent = `${totalQuantity} ${totalQuantity === 1 ? "Item" : "Items"}`;

    if (!cart.length) {
      if (cartPage) cartPage.hidden = true;
      if (emptyCart) emptyCart.hidden = false;
      updateCartCount();
      return;
    }

    if (cartPage) cartPage.hidden = false;
    if (emptyCart) emptyCart.hidden = true;
    if (orderSummary) orderSummary.hidden = false;

    let subtotal = 0;

    cart.forEach((item, index) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const price = Number(item.price) || 0;
      const itemTotal = price * quantity;
      subtotal += itemTotal;

      const article = document.createElement("article");
      article.className = "cart-item";

      const image = document.createElement("img");
      image.src = item.image || "";
      image.alt = item.name || "NOMA product";

      const details = document.createElement("div");
      details.className = "item-details";

      const name = document.createElement("h3");
      name.textContent = item.name || "NOMA Product";

      const variant = document.createElement("p");
      variant.textContent = [item.color, item.size ? `Size ${item.size}` : ""].filter(Boolean).join(" / ") || "Standard";

      const unitPrice = document.createElement("strong");
      unitPrice.textContent = formatPrice(price);

      const quantityControl = document.createElement("div");
      quantityControl.className = "quantity";
      quantityControl.innerHTML = `
        <button type="button" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button>
        <span>${quantity}</span>
        <button type="button" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
      `;

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-item";
      remove.dataset.action = "remove";
      remove.dataset.index = index;
      remove.textContent = "Remove";

      details.append(name, variant, unitPrice, quantityControl, remove);

      const lineTotal = document.createElement("strong");
      lineTotal.className = "cart-line-total";
      lineTotal.textContent = formatPrice(itemTotal);

      article.append(image, details, lineTotal);
      cartItemsContainer.appendChild(article);
    });

    subtotalElement.textContent = formatPrice(subtotal);
    totalElement.textContent = formatPrice(subtotal);
    updateCartCount();
  }

  cartItemsContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;
    const cart = getCart();
    if (!cart[index]) return;

    if (action === "increase") cart[index].quantity = Number(cart[index].quantity || 0) + 1;
    if (action === "decrease") {
      cart[index].quantity = Number(cart[index].quantity || 0) - 1;
      if (cart[index].quantity <= 0) cart.splice(index, 1);
    }
    if (action === "remove") cart.splice(index, 1);

    saveCart(cart);
    renderCart();
  });

  document.querySelector("#checkout-button")?.addEventListener("click", () => {
    alert("Checkout and payment integration will be added next.");
  });

  renderCart();
});
