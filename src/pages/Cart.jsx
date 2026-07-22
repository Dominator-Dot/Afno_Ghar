import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, removeFromCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "Kathmandu",
    paymentMethod: "cash",
  });
  const [formErrors, setFormErrors] = useState({});

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = total > 0 ? 300 : 0;
  const grandTotal = total + deliveryFee;

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateForm() {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    return errors;
  }

  function handlePlaceOrder(e) {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsCheckingOut(true);

    // Simulate order processing
    setTimeout(() => {
      console.log("Order placed:", { ...formData, items: cartItems, total: grandTotal });
      setOrderPlaced(true);
      setIsCheckingOut(false);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }, 1500);
  }

  if (orderPlaced) {
    return (
      <section className="section cart-page">
        <div className="container">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. Your order has been confirmed.</p>
            <p className="order-details">
              A confirmation email has been sent to <strong>{formData.email}</strong>
            </p>
            <p className="redirect-message">Redirecting to home in a few seconds...</p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="section cart-page">
        <div className="container">
          <h2>Your Cart is Empty</h2>
          <p className="empty-text">
            Browse our products and click "Add" to fill your cart.
          </p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section cart-page">
      <div className="container">
        <h2>Your Cart</h2>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="cart-list">
              {cartItems.map((item) => (
                <div className="cart-row" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-row-info">
                    <h4>{item.name}</h4>
                    <p>
                      NPR {item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <div className="cart-row-total">
                    <strong>NPR {(item.price * item.quantity).toLocaleString()}</strong>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Form & Summary */}
          <div className="checkout-section">
            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>NPR {total.toLocaleString()}</strong>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <strong>NPR {deliveryFee}</strong>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <strong>NPR {grandTotal.toLocaleString()}</strong>
              </div>
            </div>

            {/* Checkout Form */}
            {!user && (
              <div className="login-required">
                <p>Please sign in to continue with checkout</p>
                <Link to="/signin" className="btn btn-primary">
                  Sign In
                </Link>
              </div>
            )}

            {user && (
              <form className="checkout-form" onSubmit={handlePlaceOrder}>
                <h3>Delivery Information</h3>

                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={isCheckingOut}
                  />
                  {formErrors.fullName && (
                    <span className="error">{formErrors.fullName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isCheckingOut}
                  />
                  {formErrors.email && (
                    <span className="error">{formErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isCheckingOut}
                  />
                  {formErrors.phone && (
                    <span className="error">{formErrors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    disabled={isCheckingOut}
                  />
                  {formErrors.address && (
                    <span className="error">{formErrors.address}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={isCheckingOut}
                  >
                    <option>Kathmandu</option>
                    <option>Lalitpur</option>
                    <option>Bhaktapur</option>
                    <option>Pokhara</option>
                    <option>Biratnagar</option>
                  </select>
                </div>

                <h3 style={{ marginTop: "30px" }}>Payment Method</h3>

                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === "cash"}
                      onChange={handleInputChange}
                      disabled={isCheckingOut}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleInputChange}
                      disabled={isCheckingOut}
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === "bank"}
                      onChange={handleInputChange}
                      disabled={isCheckingOut}
                    />
                    <span>Bank Transfer</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary place-order-btn"
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Place Order"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
