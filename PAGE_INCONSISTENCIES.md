# Page Structure and Inconsistency Report

## Overview of page connections

- `src/main.jsx` bootstraps the app with:
  - `BrowserRouter` for client-side routing
  - `AuthProvider`, `CartProvider`, and `WishlistProvider` for app-wide state
  - `App` as the main route shell

- `src/App.jsx` defines the route-to-page map:
  - `/` → `src/pages/Home.jsx`
  - `/products` → `src/pages/Products.jsx`
  - `/products/:id` → `src/pages/ProductDetail.jsx`
  - `/about` → `src/pages/About.jsx`
  - `/contact` → `src/pages/Contact.jsx`
  - `/signin` → `src/pages/SignIn.jsx`
  - `/cart` → `src/pages/Cart.jsx`

- `src/components/Navbar.jsx` renders navigation links and adapts behavior depending on whether the user is on the home page or a different route.

- `src/pages/Home.jsx` composes multiple reusable components and references `src/data/products.js` for the featured product filter.

- `src/pages/Products.jsx` and `src/pages/ProductDetail.jsx` both depend on product helper functions from `src/data/products.js`.

## Key inconsistencies found

1. **Auth gating is not consistent across product-related pages**
   - `src/pages/Products.jsx` redirects unauthenticated users to `/signin`.
   - `src/pages/ProductDetail.jsx` does not redirect unauthenticated users and remains publicly accessible.
   - `src/pages/Cart.jsx` also allows unauthenticated access to the cart page, even though checkout requires login.

   This creates a mismatch in behavior: one product page is protected, while closely related pages are not.

2. **`/cart` is partially gated**
   - Users can view the cart and remove items without signing in.
   - However, the checkout form is only shown when `user` exists.
   - The page itself is still reachable and usable by guests, which is inconsistent with the stricter `Products` route.

3. **Sign-in flow always returns to `/products`**
   - After login/signup, `SignIn.jsx` navigates to `/products` no matter where the user started.
   - If a user arrived from `/cart` or `/products/:id`, they do not return to their previous page.

4. **Navbar behavior differs by page type**
   - On the home page, nav buttons scroll to sections instead of linking to pages.
   - On the `/signin` page, the navbar previously still showed the `Sign In` link, which is redundant and inconsistent.
   - On post-login pages, the user should see greetings and logout options instead of sign-in.
   - This is intentional, but it is a structural difference worth keeping in mind when reviewing page expectations.

5. **No 404 / fallback route is defined**
   - `App.jsx` only declares explicit routes.
   - A route like `*` or a fallback page is missing, so unknown URLs will render nothing inside `<main>`.

## Suggested focus areas for cleanup

- Align auth behavior for all pages that show product listings or checkout.
- Decide whether `/products/:id` and `/cart` should require authentication like `/products`.
- Preserve return navigation after sign-in (for better UX).
- Add a catch-all route for unknown URLs.

## Files most directly involved

- `src/App.jsx`
- `src/pages/Products.jsx`
- `src/pages/ProductDetail.jsx`
- `src/pages/Cart.jsx`
- `src/pages/SignIn.jsx`
- `src/components/Navbar.jsx`
- `src/main.jsx`
- `src/data/products.js`
