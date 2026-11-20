document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.querySelector(".product-grid");
  if (!productGrid) return;

  if (typeof products === "undefined" || !Array.isArray(products)) {
    productGrid.innerHTML = '<p class="no-products">Products could not be loaded. Please refresh the page.</p>';
    console.error("NOMA: products.js must load before shop.js.");
    return;
  }

  const searchInput = document.querySelector("#product-search");
  const categoryLinks = document.querySelectorAll(".category-link");
  const sortSelect = document.querySelector("#sort-products");
  const loadMoreButton = document.querySelector(".load-more button");
  const countText = document.querySelector(".toolbar-right span");

  const productsPerPage = 6;
  let visibleProducts = productsPerPage;
  let activeCategory = "All";

  const selected = (selector, key) =>
    [...document.querySelectorAll(`${selector}:checked`)].map((input) => input.dataset[key]);

  function getFilteredProducts() {
    const term = searchInput?.value.toLowerCase().trim() || "";
    const categories = selected("input[data-category-filter]", "categoryFilter");
    const sizes = selected("input[data-size]", "size");
    const colors = selected("input[data-color]", "color");
    const prices = selected("input[data-price]", "price");

    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(term);
      const matchesCategory =
        (activeCategory === "All" || product.category === activeCategory) &&
        (!categories.length || categories.includes(product.category));

      const matchesSize =
        !sizes.length || sizes.some((size) => (product.sizes || []).includes(size));
      const matchesColor =
        !colors.length || colors.some((color) => (product.colors || []).includes(color));

      const matchesPrice =
        !prices.length ||
        prices.some((range) => {
          if (range === "under") return product.price < 10000;
          if (range === "middle") return product.price >= 10000 && product.price <= 20000;
          if (range === "above") return product.price > 20000;
          return false;
        });

      return matchesSearch && matchesCategory && matchesSize && matchesColor && matchesPrice;
    });
  }

  function sortProducts(items) {
    const sorted = [...items];
    switch (sortSelect?.value) {
      case "low-high": return sorted.sort((a, b) => a.price - b.price);
      case "high-low": return sorted.sort((a, b) => b.price - a.price);
      case "newest": return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      default: return sorted.sort((a, b) => a.id - b.id);
    }
  }

  function displayProducts(items) {
    productGrid.innerHTML = "";
    const visibleItems = items.slice(0, visibleProducts);

    if (!items.length) {
      productGrid.innerHTML = '<p class="no-products">No products found. Try adjusting your filters.</p>';
    } else {
      visibleItems.forEach((product) => {
        const card = document.createElement("a");
        card.className = "product-card";
        card.href = `product.html?id=${encodeURIComponent(product.id)}`;

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(product.price);

        card.append(image, name, price);
        productGrid.appendChild(card);
      });
    }

    if (countText) {
      countText.textContent = `Showing ${visibleItems.length} of ${items.length} products`;
    }
    if (loadMoreButton) {
      loadMoreButton.style.display = visibleItems.length < items.length ? "flex" : "none";
    }
  }

  function refresh() {
    displayProducts(sortProducts(getFilteredProducts()));
  }

  searchInput?.addEventListener("input", () => {
    visibleProducts = productsPerPage;
    refresh();
  });

  document.querySelectorAll(
    "input[data-price], input[data-size], input[data-color], input[data-category-filter]"
  ).forEach((input) => {
    input.addEventListener("change", () => {
      visibleProducts = productsPerPage;
      refresh();
    });
  });

  categoryLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      activeCategory = link.dataset.category || "All";
      visibleProducts = productsPerPage;
      categoryLinks.forEach((item) => item.classList.toggle("active", item === link));
      refresh();
    });
  });

  sortSelect?.addEventListener("change", () => {
    visibleProducts = productsPerPage;
    refresh();
  });

  loadMoreButton?.addEventListener("click", () => {
    visibleProducts += productsPerPage;
    refresh();
  });

  document.querySelector("#clear-filters")?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (sortSelect) sortSelect.value = "featured";
    document.querySelectorAll("input[type='checkbox']").forEach((input) => {
      input.checked = false;
    });
    activeCategory = "All";
    visibleProducts = productsPerPage;
    categoryLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.category === "All");
    });
    refresh();
  });

  refresh();
});
