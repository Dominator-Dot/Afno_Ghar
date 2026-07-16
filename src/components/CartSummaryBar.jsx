import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartSummaryBar.css";

/*
  Small sticky bar shown on the product listing page so shoppers
  always know how many items they've added and the running total,
  without needing to open the full cart page.
*/
function CartSummaryBar() {
  const { cartItems, totalItemsInCart } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (totalItemsInCart === 0) return null;

  return (
    <div className="cart-summary-bar">
      <span className="cart-summary-count">
        {totalItemsInCart} item{totalItemsInCart !== 1 ? "s" : ""} in cart
      </span>
      <span className="cart-summary-total">
        Total: NPR {totalPrice.toLocaleString()}
      </span>
      <Link to="/cart" className="btn btn-primary cart-summary-btn">
        View Cart
      </Link>
    </div>
  );
}

export default CartSummaryBar;
