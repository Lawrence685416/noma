const products = [
  {
    id: 1,
    name: "Everyday Essential Tee",
    price: 18500,
    category: "Clothing",
    image: "./assets/product-1.avif",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Beige"],
    dateAdded: "2026-11-10",
  },
  {
    id: 2,
    name: "Classic Linen Shirt",
    price: 25000,
    category: "Clothing",
    image: "./assets/product-2.avif",
    sizes: ["M", "L", "XL"],
    colors: ["White", "Beige"],
    dateAdded: "2026-11-12",
  },
  {
    id: 3,
    name: "Minimal Leather Bag",
    price: 32000,
    category: "Accessories",
    image: "./assets/product-3.avif",
    sizes: ["One Size"],
    colors: ["Black", "Brown"],
    dateAdded: "2026-11-08",
  },
  {
    id: 4,
    name: "Relaxed Cotton Trousers",
    price: 22000,
    category: "Clothing",
    image: "./assets/product-4.avif",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Beige"],
    dateAdded: "2026-11-14",
  },
  {
    id: 5,
    name: "Everyday Tote",
    price: 15000,
    category: "Accessories",
    image: "./assets/product-5.avif",
    sizes: ["One Size"],
    colors: ["White", "Beige"],
    dateAdded: "2026-11-15",
  },
  {
    id: 6,
    name: "Classic Everyday Shirt",
    price: 20000,
    category: "Essentials",
    image: "./assets/product-6.avif",
    sizes: ["S", "M", "L"],
    colors: ["White", "Black"],
    dateAdded: "2026-11-16",
  },
];

// Select product grid
const productGrid = document.querySelector(".product-grid");

// Display products
function displayProducts(items) {
  productGrid.innerHTML = "";

  items.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₦${product.price.toLocaleString("en-NG")}</p>
    `;

    productGrid.appendChild(productCard);
  });
}

// Initial display
displayProducts(products);

// SEARCH FUNCTIONALITY

// SEARCH AND CATEGORY FILTERING

const searchInput = document.querySelector("#product-search");
const categoryLinks = document.querySelectorAll(".category-link");

let activeCategory = "All";

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  // Get selected price filters
  const selectedPrices = document.querySelectorAll("input[data-price]:checked");

  const priceRanges = Array.from(selectedPrices).map(
    (checkbox) => checkbox.dataset.price,
  );

  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);

    // Category filter
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    // Price filter
    const matchesPrice =
      priceRanges.length === 0 ||
      priceRanges.some((range) => {
        if (range === "under") {
          return product.price < 10000;
        }

        if (range === "middle") {
          return product.price >= 10000 && product.price <= 20000;
        }

        if (range === "above") {
          return product.price > 20000;
        }
      });

    return matchesSearch && matchesCategory && matchesPrice;
  });

  displayProducts(filteredProducts);
}

// Search event
searchInput.addEventListener("input", filterProducts);

// Category event
categoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    activeCategory = link.dataset.category;

    categoryLinks.forEach((item) => {
      item.classList.remove("active");
    });

    link.classList.add("active");

    filterProducts();
  });
});

// PRICE FILTER EVENT
const priceCheckboxes = document.querySelectorAll("input[data-price]");

priceCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", filterProducts);
});
