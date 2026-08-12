import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

    setOrders(savedOrders);
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "25px",
            }}
          >
            <h2>Order #{order.id}</h2>

            <p>
              <strong>Status:</strong>{" "}
              {order.status}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {order.createdAt}
            </p>

            <h3>Customer Details</h3>

            <p>
              <strong>Name:</strong>{" "}
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

            <hr />

            <h3>Products</h3>

            {order.items.map((item) => (
              <div
                key={item.id}
                style={{
                  marginBottom: "15px",
                }}
              >
                <h4>{item.productName}</h4>

                <p>
                  Price: Rs. {item.basePrice}
                </p>

                <p>
                  Material: {item.material}
                </p>

                <p>
                  Color: {item.color}
                </p>

                <p>
                  Dimensions:{" "}
                  {item.length || "-"} ×{" "}
                  {item.width || "-"} ×{" "}
                  {item.height || "-"} cm
                </p>

                <p>
                  Instructions:{" "}
                  {item.instructions || "None"}
                </p>

                <p>
                  Quantity: {item.quantity}
                </p>
              </div>
            ))}

            <hr />

            <h3>
              Total: Rs. {order.totalPrice}
            </h3>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;