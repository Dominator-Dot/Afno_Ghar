import { createContext, useContext, useState } from "react";

/*
  WHAT IS THIS FILE?
  -------------------
  Similar to CartContext, this manages a wishlist (favorites list)
  that users can build while browsing products.
  
  Features:
    - Add/remove products from wishlist
    - Persist wishlist to localStorage
    - Hook to check if product is in wishlist
*/

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("afnoghar_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  function addToWishlist(product) {
    setWishlistItems((prevItems) => {
      // Don't add if already in wishlist
      if (prevItems.find((item) => item.id === product.id)) {
        return prevItems;
      }
      const updated = [...prevItems, { ...product }];
      localStorage.setItem("afnoghar_wishlist", JSON.stringify(updated));
      return updated;
    });
  }

  function removeFromWishlist(productId) {
    setWishlistItems((prevItems) => {
      const updated = prevItems.filter((item) => item.id !== productId);
      localStorage.setItem("afnoghar_wishlist", JSON.stringify(updated));
      return updated;
    });
  }

  function isInWishlist(productId) {
    return wishlistItems.some((item) => item.id === productId);
  }

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
