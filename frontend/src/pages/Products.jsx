import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Could not load products.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "auto",
      }}
    >
      <h1>Furniture Products</h1>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <h2>{product.name}</h2>

              <p>
                {product.description ||
                  "Furniture product"}
              </p>

              <p>
                <strong>Price:</strong> Rs.{" "}
                {product.base_price}
              </p>

              <p>
                <strong>Stock:</strong>{" "}
                {product.stock_quantity}
              </p>

              <p>
                <strong>Type:</strong>{" "}
                {product.product_type}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {product.status}
              </p>

              {product.is_customizable && (
                <>
                  <p
                    style={{
                      color: "green",
                      fontWeight: "bold",
                    }}
                  >
                    ✓ Customization Available
                  </p>

                  <Link to="/">
                    <button
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#2f5d50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Customize
                    </button>
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;