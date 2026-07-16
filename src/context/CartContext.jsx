import { createContext, useContext, useState } from "react";

/*
  WHAT IS THIS FILE?
  -------------------
  Several components need to know about the shopping cart:
    - Navbar (shows the little number badge on the bag icon)
    - ProductCard (the "Add" button adds an item)
    - A future Cart / Checkout page (would list all items)

  Instead of passing the cart data down through props from
  parent to child to grandchild ("prop drilling"), we use
  React's built-in Context API. Think of it as a small box
  of shared state that ANY component can reach into, as long
  as it is wrapped inside <CartProvider>.
*/

// 1. Create the context object itself.
const CartContext = createContext();

// 2. Create a "Provider" component. Anything placed inside
//    <CartProvider>...</CartProvider> will be able to use the cart.
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Adds a product to the cart (or increases its quantity if
  // it's already there).
  function addToCart(product, quantity) {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Product already in cart -> just bump the quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // New product -> add it to the array
      return [...prevItems, { ...product, quantity }];
    });
  }

  function removeFromCart(productId) {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  }

  // Total number of items in the cart (used for the badge count)
  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Everything inside "value" becomes available to any component
  // that calls useCart() below.
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    totalItemsInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 3. A small custom hook so components can simply write:
//      const { addToCart } = useCart();
//    instead of importing useContext + CartContext every time.
export function useCart() {
  return useContext(CartContext);
}
