import "./FeatureHighlights.css";

/*
  This data lives right inside the component file (instead of
  the /data folder) because it is only ever used here and is
  unlikely to change. Small, one-off lists like this are fine
  to keep local — you don't need a separate file for everything.
*/
const features = [
  {
    icon: "🌿",
    title: "Natural Materials",
    text: "Sustainably sourced wood and fabric.",
  },
  {
    icon: "🤝",
    title: "Handcrafted",
    text: "Each piece made with care and precision.",
  },
  {
    icon: "🚚",
    title: "Free Delivery",
    text: "Free delivery within Kathmandu Valley.",
  },
  {
    icon: "🛡️",
    title: "5-Year Warranty",
    text: "Confidence in every joint and seam.",
  },
];

function FeatureHighlights() {
  return (
    <section className="feature-band">
      <div className="container feature-grid">
        {features.map((feature) => (
          <div className="feature-item" key={feature.title}>
            <span className="feature-icon">{feature.icon}</span>
            <h4>{feature.title}</h4>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureHighlights;
