import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ProductFilterGrid from "../components/ProductFilterGrid";
import CartSummaryBar from "../components/CartSummaryBar";
import { useAuth } from "../context/AuthContext";
import products from "../data/products";
import "./Products.css";

function Products() {
  const { user, initializing } = useAuth();
  const navigate = useNavigate();

  // Redirect to signin if user is not logged in
  useEffect(() => {
    if (!initializing && !user) {
      navigate("/signin");
    }
  }, [user, initializing, navigate]);

  // Show loading while checking auth status
  if (initializing) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  // If user is not authenticated, the effect above will navigate away
  if (!user) {
    return null;
  }

  return (
    <section className="section products-page">
      <div className="container">
        <span className="section-eyebrow">Shop The Range</span>
        <h2 className="section-title">All Products</h2>
        <CartSummaryBar />
        <ProductFilterGrid products={products} />
      </div>
    </section>
  );
}

export default Products;
