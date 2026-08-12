import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const stages = [
    "Order Confirmed",
    "Materials Collected",
    "Assembly",
    "Polishing",
    "Ready for Delivery",
    "Delivered",
  ];

  useEffect(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

    setOrders(savedOrders);
  }, []);

  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: newStatus,
          }
        : order
    );

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    alert("Order status updated!");
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <h1>Admin - Order Management</h1>

      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "25px",
            }}
          >
            <h2>Order #{order.id}</h2>

            <p>
              <strong>Customer:</strong>{" "}
              {order.customer.fullName}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {order.customer.phone}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {order.customer.address}
            </p>

            <p>
              <strong>Total:</strong> Rs.{" "}
              {order.totalPrice}
            </p>

            <p>
              <strong>Current Status:</strong>{" "}
              {order.status}
            </p>

            <label>
              <strong>Change Status:</strong>
            </label>

            <br />

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(
                  order.id,
                  e.target.value
                )
              }
              style={{
                padding: "10px",
                marginTop: "8px",
              }}
            >
              {stages.map((stage) => (
                <option
                  key={stage}
                  value={stage}
                >
                  {stage}
                </option>
              ))}
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;