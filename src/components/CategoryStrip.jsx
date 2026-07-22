import "./CategoryStrip.css";

const categories = [
  "Sofas & Sectionals",
  "Beds & Mattresses",
  "Dining Tables",
  "Wardrobes",
  "Curtains",
  "Home Décor",
];

function CategoryStrip() {
  return (
    <div className="category-strip">
      {/* We render the list twice in a row so the CSS animation
          can loop seamlessly, creating an infinite scrolling effect. */}
      <div className="category-strip-track">
        {[...categories, ...categories].map((category, index) => (
          <span className="category-item" key={index}>
            {category} <span className="dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default CategoryStrip;
