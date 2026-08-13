import "./Hero.css";

function Hero() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => scrollToSection("featured-products")}
            >
              Shop Now
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => scrollToSection("our-story")}
            >
              Our Story
            </button>
          </div>
        </div>

        <span className="scroll-hint">SCROLL</span>
      </div>
    </section>
  );
}

export default Hero;
