import { useState } from "react";

function Checkout() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const cart = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.basePrice) * item.quantity,
    0
  );

  const handleOrder = (e) => {
    e.preventDefault();

    if (!fullName || !phone || !address) {
      alert("Please fill all delivery details.");
      return;
    }

    const order = {
      id: Date.now(),
      customer: {
        fullName,
        phone,
        address,
      },
      items: cart,
      totalPrice,
      status: "Order Confirmed",
      createdAt: new Date().toLocaleString(),
    };

    const oldOrders = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

    oldOrders.push(order);

    localStorage.setItem(
      "orders",
      JSON.stringify(oldOrders)
    );

    localStorage.removeItem("cart");

    alert("Order placed successfully!");
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h1>Checkout</h1>

      <h3>Order Summary</h3>

      {cart.map((item) => (
        <div key={item.id}>
          <p>
            {item.productName} - Rs. {item.basePrice}
          </p>
        </div>
      ))}

      <h3>Total: Rs. {totalPrice}</h3>

      <hr />

      <h3>Delivery Information</h3>

      <form onSubmit={handleOrder}>
        <div style={{ marginBottom: "15px" }}>
          <label>Full Name</label>
          <br />

          <input
            type="text"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Phone Number</label>
          <br />

          <input
            type="text"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Delivery Address</label>
          <br />

          <textarea
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            rows="4"
          />
        </div>

        <button type="submit">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;