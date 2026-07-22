import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductFilterGrid from "../components/ProductFilterGrid";
import CartSummaryBar from "../components/CartSummaryBar";
import { useAuth } from "../context/AuthContext";
import { fetchAllProducts } from "../api/productsApi";
import staticProducts from "../data/products";
import "./Products.css";

function Products() {
  const { user, initializing } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Redirect to signin if user is not logged in
  useEffect(() => {
    if (!initializing && !user) {
      navigate("/signin");
    }
  }, [user, initializing, navigate]);

  // Load the product catalogue from the backend (Afno_Ghar-Backend's
  // /api/products). If the backend isn't running yet, fall back to the
  // bundled demo data instead of showing a broken/empty page -- the same
  // "keep working without a backend" philosophy AuthContext already uses.
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await fetchAllProducts();
        if (!cancelled) {
          setProducts(data.length ? data : staticProducts);
        }
      } catch {
        if (!cancelled) {
          setProducts(staticProducts);
        }
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const materials = ["All", ...new Set(products.map((p) => p.material))];

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
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : (
          <ProductFilterGrid
            products={products}
            categories={categories}
            materials={materials}
          />
        )}
      </div>
    </section>
  );
}

export default Products;
