import { useEffect, useState } from "react";

function Tracking() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

    setOrders(savedOrders);
  }, []);

  const stages = [
    "Order Confirmed",
    "Materials Collected",
    "Assembly",
    "Polishing",
    "Ready for Delivery",
    "Delivered",
  ];

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "850px",
        margin: "auto",
      }}
    >
      <h1>Order Tracking</h1>

      {orders.length === 0 ? (
        <p>No orders available for tracking.</p>
      ) : (
        orders.map((order) => {
          const currentStage = stages.indexOf(
            order.status
          );

          return (
            <div
              key={order.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "25px",
                marginBottom: "30px",
              }}
            >
              <h2>Order #{order.id}</h2>

              <p>
                <strong>Current Status:</strong>{" "}
                {order.status}
              </p>

              <p>
                <strong>Total:</strong> Rs.{" "}
                {order.totalPrice}
              </p>

              <hr />

              <h3>Production Progress</h3>

              {stages.map((stage, index) => (
                <div
                  key={stage}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                      marginRight: "15px",
                      backgroundColor:
                        index <= currentStage
                          ? "#2f5d50"
                          : "#ccc",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {index <= currentStage
                      ? "✓"
                      : index + 1}
                  </div>

                  <span
                    style={{
                      fontWeight:
                        index === currentStage
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Tracking;