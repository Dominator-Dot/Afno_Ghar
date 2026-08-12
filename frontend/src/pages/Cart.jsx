import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(savedCart);
  }, []);

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h1>My Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            >
              <h2>{item.productName}</h2>

              <p>
                <strong>Price:</strong> Rs. {item.basePrice}
              </p>

              <p>
                <strong>Material:</strong> {item.material}
              </p>

              <p>
                <strong>Color:</strong> {item.color}
              </p>

              <p>
                <strong>Dimensions:</strong>{" "}
                {item.length || "-"} ×{" "}
                {item.width || "-"} ×{" "}
                {item.height || "-"} cm
              </p>

              <p>
                <strong>Instructions:</strong>{" "}
                {item.instructions || "None"}
              </p>

              <p>
                <strong>Quantity:</strong> {item.quantity}
              </p>

              <button
                onClick={() => removeItem(item.id)}
                style={{
                  padding: "8px 15px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <Link to="/checkout">
            <button
              style={{
                padding: "12px 25px",
                backgroundColor: "#2f5d50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Proceed to Checkout
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;