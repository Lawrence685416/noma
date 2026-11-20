# NOMA — corrected project

## What was fixed
- Added the missing `js/products.js` shared catalogue and cart helpers.
- Corrected `shop.html` so it loads `products.js` before `shop.js` (and no longer loads `product.js` on the shop page).
- Added category checkbox data attributes and made shop filtering defensive.
- Added `products.js` to the homepage so the shared cart count helper is available.
- Rebuilt `cart.html` to use the element IDs expected by the cart script.
- Reworked `cart.js` to render the actual `nomaCart` contents, update quantities, remove items, and calculate totals.
- Corrected the homepage stylesheet path and linked the bag icon to the cart.
- Updated the shared navigation cart count.

## Product catalogue
The archive contained seven product images (`product-1.avif` through `product-7.avif`), so the shared catalogue currently contains seven matching entries. Add more product images and catalogue entries when they are ready.

## How to run
1. Extract the ZIP.
2. Open the `NOMA` folder in VS Code.
3. Use the Live Server extension to open `index.html`.
4. Go to Shop, open a product, select its options, and add it to your bag.
5. Open the Bag page to change quantities or remove items.

Use Live Server rather than opening the HTML files directly, to keep local paths consistent.
