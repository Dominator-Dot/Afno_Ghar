import Hero from "../components/Hero";
import CategoryStrip from "../components/CategoryStrip";
import FeatureHighlights from "../components/FeatureHighlights";
import CollectionsGrid from "../components/CollectionsGrid";
import ProductFilterGrid from "../components/ProductFilterGrid";
import Testimonials from "../components/Testimonials";
import RentalInfo from "../components/RentalInfo";
import products from "../data/products";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/*
  The Home page doesn't contain much logic itself — its job is
  simply to arrange the bigger building-block components in
  the right order. This is a common React pattern: "page"
  components are mostly layout, while the actual UI pieces
  live in reusable components.
*/
function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const target = location.state && location.state.scrollTo;
    if (target) {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      // Clear the navigation state so reloading or returning doesn't re-scroll
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
      <section id="hero">
        <Hero />
      </section>

      <section id="categories">
        <CategoryStrip />
      </section>

      <section id="features">
        <FeatureHighlights />
      </section>

      <RentalInfo />

      <section id="collections">
        <CollectionsGrid />
      </section>

      <section id="featured-products" className="section">
        <div className="container">
          <span className="section-eyebrow">Our Catalogue</span>
          <h2 className="section-title">Featured Products</h2>
          <ProductFilterGrid products={products} showAdvancedFilters={false} />
        </div>
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>
    </>
  );
}

export default Home;
