// NOMA shared product catalogue and cart helpers.
// Load this file before shop.js, product.js, cart.js and main.js.

const products = [
  {
    id: 1,
    name: "Everyday Essential Tee",
    price: 18500,
    category: "Essentials",
    image: "./assets/product-1.avif",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Beige"],
    dateAdded: "2026-11-10"
  },
  {
    id: 2,
    name: "Classic Linen Shirt",
    price: 25000,
    category: "Clothing",
    image: "./assets/product-2.avif",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Beige"],
    dateAdded: "2026-11-11"
  },
  {
    id: 3,
    name: "Minimal Leather Bag",
    price: 32000,
    category: "Accessories",
    image: "./assets/product-3.avif",
    sizes: [],
    colors: ["Black", "Beige"],
    dateAdded: "2026-11-12"
  },
  {
    id: 4,
    name: "Relaxed Cotton Trousers",
    price: 22000,
    category: "Clothing",
    image: "./assets/product-4.avif",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Beige"],
    dateAdded: "2026-11-13"
  },
  {
    id: 5,
    name: "Everyday Tote",
    price: 15000,
    category: "Accessories",
    image: "./assets/product-5.avif",
    sizes: [],
    colors: ["Black", "Beige"],
    dateAdded: "2026-11-14"
  },
  {
    id: 6,
    name: "Classic Everyday Shirt",
    price: 20000,
    category: "Essentials",
    image: "./assets/product-6.avif",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black"],
    dateAdded: "2026-11-15"
  },
  {
    id: 7,
    name: "Premium Cotton Hoodie",
    price: 35000,
    category: "Clothing",
    image: "./assets/product-7.avif",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Beige"],
    dateAdded: "2026-11-16"
  }
];

function formatPrice(price) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(Number(price) || 0);
}

function getCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("nomaCart"));
    return Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    console.error("Could not read NOMA cart:", error);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("nomaCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const total = getCart().reduce(
    (sum, item) => sum + Math.max(0, Number(item.quantity) || 0),
    0
  );

  document.querySelectorAll(".cart-count").forEach((element) => {
    element.textContent = total;
  });
}
