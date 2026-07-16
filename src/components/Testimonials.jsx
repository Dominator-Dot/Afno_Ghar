import testimonials from "../data/testimonials";
import "./Testimonials.css";

function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <span className="section-eyebrow">What Customers Say</span>
        <h2 className="section-title">Loved by Families Across Nepal</h2>

        <div className="testimonial-grid">
          {testimonials.map((review, index) => (
            <div
              // The middle card gets a special "highlighted" style,
              // just like in the original design mock-up.
              className={`testimonial-card ${
                index === 1 ? "highlighted" : ""
              }`}
              key={review.id}
            >
              <div className="stars">{"★".repeat(review.rating)}</div>
              <p className="quote">"{review.quote}"</p>
              <div className="reviewer">
                <div className="avatar" />
                <div>
                  <p className="reviewer-name">{review.name}</p>
                  <p className="reviewer-location">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
