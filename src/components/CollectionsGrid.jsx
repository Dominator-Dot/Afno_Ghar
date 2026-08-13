import { Link } from "react-router-dom";
import "./CollectionsGrid.css";

const collections = [
  {
    name: "Sofas",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80",
    options: 14,
    description: "Soft seating in rich textures for every living room.",
  },
  {
    name: "Beds",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=500&q=80",
    options: 8,
    description: "Cozy bed frames crafted with premium materials.",
  },
  {
    name: "Tables",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=500&q=80",
    options: 10,
    description: "Dining and accent tables with elegant finishes.",
  },
  {
    name: "Chairs",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=500&q=80",
    options: 12,
    description: "Comfortable seating designed for work and rest.",
  },
  {
    name: "Curtains",
    image:
      "https://images.unsplash.com/photo-1585128993280-9456c19c5116?auto=format&fit=crop&w=500&q=80",
    options: 6,
    description: "Light-filtering curtains in warm hues and textures.",
  },
  {
    name: "Décor",
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=500&q=80",
    options: 22,
    description: "Accent pieces to complete the look of any room.",
  },
];

function CollectionsGrid() {
  return (
    <section className="section">
      <div className="container">
        <span className="section-eyebrow">Browse By Room</span>
        <h2 className="section-title">Our Collections</h2>

        <div className="collections-grid">
          {collections.map((collection) => (
            <Link
              to="/products"
              className="collection-card"
              key={collection.name}
              style={{ backgroundImage: `url(${collection.image})` }}
            >
              <div className="collection-overlay">
                <div className="collection-card-meta">
                  <span>{collection.options} options</span>
                </div>
                <div className="collection-card-content">
                  <h3>{collection.name}</h3>
                  <p>{collection.description}</p>
                </div>
                <span>View →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CollectionsGrid;
