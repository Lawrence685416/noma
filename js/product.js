
document.addEventListener("DOMContentLoaded", () => {
  // =====================================
  // 1. GET PRODUCT FROM URL
  // =====================================

  const productGrid = document.querySelector(".product-details");

  if (!productGrid) return;

  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id"));

  const product = products.find(item => item.id === productId);

  // =====================================
  // 2. GET HTML ELEMENTS
  // =====================================

  const productImage = document.querySelector("#product-image");
  const productName = document.querySelector("#product-name");
  const productPrice = document.querySelector("#product-price");
  const productCategory = document.querySelector("#product-category");

  const sizesContainer = document.querySelector("#product-sizes");
  const colorsContainer = document.querySelector("#product-colors");

  const quantityDisplay = document.querySelector("#quantity");
  const decreaseButton = document.querySelector("#decrease-quantity");
  const increaseButton = document.querySelector("#increase-quantity");

  const addToCartButton = document.querySelector("#add-to-cart");
  const cartMessage = document.querySelector("#cart-message");

  // =====================================
  // 3. HANDLE INVALID PRODUCT
  // =====================================

  if (!product) {
    productName.textContent = "Product not found";
    productPrice.textContent = "";
    productImage.style.display = "none";

    if (productCategory) {
      productCategory.textContent = "Not found";
    }

    if (sizesContainer) sizesContainer.innerHTML = "";
    if (colorsContainer) colorsContainer.innerHTML = "";

    addToCartButton.disabled = true;
    addToCartButton.textContent = "Unavailable";

    return;
  }

  // =====================================
  // 4. DISPLAY PRODUCT INFORMATION
  // =====================================

  document.title = `${product.name} | NOMA`;

  productImage.src = product.image;
  productImage.alt = product.name;

  productName.textContent = product.name;
  productPrice.textContent = formatPrice(product.price);
  productCategory.textContent = product.category;

  productImage.onerror = () => {
    productImage.alt = `${product.name} image unavailable`;
    productImage.style.background = "#F0EEE9";
  };

  // =====================================
  // 5. PRODUCT SELECTION STATE
  // =====================================

  let selectedSize = product.sizes?.[0] || "";
  let selectedColor = product.colors?.[0] || "";
  let quantity = 1;

  // =====================================
  // 6. DISPLAY SIZE OPTIONS
  // =====================================

  function displaySizes() {
    sizesContainer.innerHTML = "";

    if (!product.sizes || product.sizes.length === 0) {
      sizesContainer.closest(".product-option").style.display = "none";
      return;
    }

    product.sizes.forEach(size => {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = size;

      button.classList.toggle("active", size === selectedSize);

      button.addEventListener("click", () => {
        selectedSize = size;

        displaySizes();
      });

      sizesContainer.appendChild(button);
    });
  }

  // =====================================
  // 7. DISPLAY COLOUR OPTIONS
  // =====================================

  function displayColors() {
    colorsContainer.innerHTML = "";

    if (!product.colors || product.colors.length === 0) {
      colorsContainer.closest(".product-option").style.display = "none";
      return;
    }

    product.colors.forEach(color => {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = color;

      button.classList.toggle("active", color === selectedColor);

      button.addEventListener("click", () => {
        selectedColor = color;

        displayColors();
      });

      colorsContainer.appendChild(button);
    });
  }

  displaySizes();
  displayColors();

  // =====================================
  // 8. QUANTITY CONTROLS
  // =====================================

  function updateQuantity() {
    quantityDisplay.textContent = quantity;
  }

  decreaseButton.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      updateQuantity();
    }
  });

  increaseButton.addEventListener("click", () => {
    quantity++;
    updateQuantity();
  });

  // =====================================
  // 9. CART STORAGE
  // =====================================

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("nomaCart")) || [];
    } catch (error) {
      console.error("Could not read cart:", error);
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("nomaCart", JSON.stringify(cart));
    updateCartCount();
  }

  // =====================================
  // 10. UPDATE CART COUNT
  // =====================================

  function updateCartCount() {
    const cart = getCart();

    const totalItems = cart.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );

    document.querySelectorAll(".cart-count").forEach(count => {
      count.textContent = totalItems;
    });
  }

  // =====================================
  // 11. ADD PRODUCT TO CART
  // =====================================

  addToCartButton.addEventListener("click", () => {
    if (product.sizes?.length && !selectedSize) {
      cartMessage.textContent = "Please select a size.";
      return;
    }

    if (product.colors?.length && !selectedColor) {
      cartMessage.textContent = "Please select a colour.";
      return;
    }

    const cart = getCart();

    const existingItem = cart.find(item =>
      item.id === product.id &&
      item.size === selectedSize &&
      item.color === selectedColor
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity
      });
    }

    try {
      saveCart(cart);

      cartMessage.textContent = "Added to your bag successfully!";

      addToCartButton.textContent = "Added to Bag";

      setTimeout(() => {
        addToCartButton.textContent = "Add to Bag";
        cartMessage.textContent = "";
      }, 2000);

      quantity = 1;
      updateQuantity();

    } catch (error) {
      console.error("Cart save failed:", error);
      cartMessage.textContent = "Unable to add item. Please try again.";
    }
  });

  // =====================================
  // 12. INITIAL CART COUNT
  // =====================================

  updateCartCount();
});
