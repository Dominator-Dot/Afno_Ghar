import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

/*
  This is the entry point of the whole React app.
  - BrowserRouter enables page navigation (react-router-dom).
  - AuthProvider makes the logged-in user (if any) available to
    every component (see context/AuthContext.jsx).
  - CartProvider makes the shopping cart state available to
    every component in the app (see context/CartContext.jsx).
  - WishlistProvider makes the wishlist state available to
    every component in the app (see context/WishlistContext.jsx).
*/
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
