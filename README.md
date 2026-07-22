# AfnoGhar — Furniture Store Frontend

A React.js frontend for a furniture e-commerce site, styled with a **teal**
color theme. Built with Vite + React + React Router.

This project was written to be **beginner-friendly**: every file has comments
explaining *why* the code is written the way it is, not just *what* it does.

---

## 1. How to run this project

You'll need Node.js (version 18 or newer) installed.

```bash
# 1. Install all dependencies (only needed once)
npm install

# 2. Start the local development server
npm run dev
```

Then open the URL shown in your terminal (usually http://localhost:5173).

### Running the backend too

This app talks to a real backend for auth, products, and rentals
(see `src/api/`). That backend lives in the separate
`Afno_Ghar-Backend` project -- clone/download it, follow its own
README to set up PostgreSQL and a `.env`, then run it with
`npm start` (defaults to `http://localhost:5000`). This repo's
`VITE_API_BASE_URL` (see `.env` / `src/api/client.js`) already
defaults to `http://localhost:5000/api`, so no extra config is
needed if you use the default port.

If the backend isn't running, the app still works: auth falls back
to a local demo mode, and the product pages fall back to the
bundled sample data in `src/data/products.js`. Renting an item does
require the backend, since rental requests are not simulated
offline.

An older, throwaway mock backend used to live in this repo
(`server.js` + `api/`) -- it has been superseded by the real
backend above and is no longer wired into `npm run dev`. See
`BACKEND_SETUP.md` for details.

Other useful commands:

```bash
npm run build     # Creates an optimized production build in /dist
npm run preview   # Preview the production build locally
```

---

## 2. Folder structure

```
afnoghar-frontend/
├── index.html                # The single HTML page the whole app lives in
├── package.json               # Project info + list of dependencies
├── vite.config.js             # Build tool configuration
├── src/
│   ├── main.jsx                # Entry point — renders <App /> into index.html
│   ├── App.jsx                 # Sets up page routing (which URL shows which page)
│   ├── index.css               # Global styles + THE TEAL COLOR THEME VARIABLES
│   │
│   ├── components/             # Small, reusable pieces of UI
│   │   ├── Navbar.jsx / .css        # Top navigation bar
│   │   ├── Footer.jsx / .css        # Bottom footer
│   │   ├── Hero.jsx / .css          # Big banner section on the Home page
│   │   ├── CategoryStrip.jsx / .css # Scrolling category ticker
│   │   ├── FeatureHighlights.jsx / .css  # "Natural Materials / Handcrafted..." band
│   │   ├── CollectionsGrid.jsx / .css    # "Our Collections" image grid
│   │   ├── ProductCard.jsx / .css        # A single product card (image, price, Add button)
│   │   ├── ProductFilterGrid.jsx / .css  # Filter tabs (ALL/SOFAS/BEDS..) + grid of ProductCards
│   │   └── Testimonials.jsx / .css       # Customer review cards
│   │
│   ├── pages/                   # Full pages, built by combining components above
│   │   ├── Home.jsx              # "/"          — the homepage
│   │   ├── Products.jsx / .css   # "/products"  — full product catalogue
│   │   ├── About.jsx / .css      # "/about"     — our story page
│   │   ├── Contact.jsx / .css    # "/contact"   — contact form
│   │   ├── SignIn.jsx / .css     # "/signin"    — login form (front-end only demo)
│   │   └── Cart.jsx / .css       # "/cart"      — shows items added to the cart
│   │
│   ├── context/
│   │   └── CartContext.jsx       # Shares "shopping cart" data across the whole app
│   │
│   ├── data/
│   │   ├── products.js            # Sample product data (acts like a mini database)
│   │   └── testimonials.js        # Sample customer reviews
│   │
│   └── assets/                    # (empty) put local images/icons here if needed
```

### Why organized this way?

- **components/** holds small, *reusable* pieces (a button, a card, a nav
  bar). If two pages need the same thing (like a product card), we write it
  once here and import it wherever it's needed.
- **pages/** holds the *full* pages of the site. Pages are mostly just
  layout — they arrange components in the right order, they don't usually
  contain much logic themselves.
- **context/** holds shared state (data that many different, unrelated
  components need to read or change) — in this project, that's the shopping
  cart.
- **data/** holds sample data as plain JavaScript files. In a real
  production app, this data would come from a backend server / database
  instead, but keeping it here lets the frontend work completely on its own
  for now.

---

## 3. How the teal theme works

All colors are defined once, at the top of **src/index.css**, as CSS
variables:

```css
:root {
  --color-teal-900: #0b3d3a;
  --color-teal-800: #0f4c46;
  --color-teal-700: #106b63;
  --color-accent: #c9a227;
  /* ...and more */
}
```

Every component's CSS file then reuses these variables, e.g.
`background-color: var(--color-teal-700);`. If you ever want to change the
whole site's color scheme, you only need to edit these variables in one
place — you don't have to hunt through every CSS file.

---

## 4. Key React concepts used (for beginners)

- **Components** — Each `.jsx` file exports one function that returns some
  JSX (HTML-like syntax). Think of components as custom, reusable HTML tags.
- **Props** — Data passed *into* a component, e.g. `<ProductCard product={item} />`.
  Inside `ProductCard`, you read it back out as `product`.
- **State (useState)** — Data that can change while the app is running,
  e.g. the quantity number on a product card, or which filter tab is active.
  When state changes, React automatically re-renders the screen.
- **Context (useContext)** — A way to share state (like the cart) between
  components that aren't directly connected, without passing props through
  every level in between. See src/context/CartContext.jsx.
- **React Router** — Lets the app feel like it has multiple "pages"
  (Home, Products, About...) while still being a single HTML page under the
  hood. See src/App.jsx.

---

## 5. Next steps / ideas to extend this project

- Connect a real backend (Node/Express, Django, etc.) and replace the data
  in src/data/ with API calls (fetch).
- Add real user authentication on the Sign In page.
- Add a checkout flow to the Cart page.
- Replace the Unsplash placeholder images with real product photography.
