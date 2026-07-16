import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      {/* This dark overlay sits on top of the background image
          so the white text stays readable (see Hero.css). */}
      <div className="hero-overlay">
        <div className="container hero-content">
          <p className="hero-eyebrow">EST. 2005 · KATHMANDU, NEPAL</p>

          <h1 className="hero-title">
            Comfort Meets <span className="hero-italic">Style</span> at
            AfnoGhar
          </h1>

          <p className="hero-subtitle">
            Handcrafted pieces that transform a house into a home. Discover
            timeless furniture and décor curated for modern living.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
            <Link to="/about" className="btn btn-outline">
              Our Story
            </Link>
          </div>
        </div>

        <span className="scroll-hint">SCROLL</span>
      </div>
    </section>
  );
}

export default Hero;
