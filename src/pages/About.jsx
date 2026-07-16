import "./About.css";

function About() {
  return (
    <section className="section about-page">
      <div className="container about-grid">
        <div className="about-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=800&q=80"
            alt="AfnoGhar workshop showroom"
          />
          <div className="about-badge">
            <strong>18+</strong>
            <span>Years of Craftsmanship</span>
          </div>
        </div>

        <div className="about-content">
          <span className="section-eyebrow" style={{ textAlign: "left" }}>
            Our Story
          </span>
          <h2>Built on Quality, Rooted in Nepal</h2>

          <p>
            AfnoGhar was founded in 2005 in the heart of Kathmandu with a
            single vision: to bring world-class furniture craftsmanship to
            Nepali homes at honest prices. What began as a small workshop has
            grown into one of the Valley's most trusted names in home
            furnishing.
          </p>

          <p>
            Every piece we create starts with sustainably sourced timber from
            certified forests. Our master carpenters, many of whom have
            worked with us for over a decade, combine traditional Nepali
            joinery techniques with contemporary design sensibilities —
            creating furniture that is as beautiful as it is durable.
          </p>

          <div className="about-stats">
            <div>
              <h3>5,000+</h3>
              <p>Happy Homes</p>
            </div>
            <div>
              <h3>350+</h3>
              <p>Products</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
