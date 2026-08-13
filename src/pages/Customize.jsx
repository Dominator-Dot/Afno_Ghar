import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../api/productsApi";
import { getProductById as getStaticProductById } from "../data/products";
import "./Customize.css";

const COLOR_OPTIONS_BY_MATERIAL = {
  Velvet: ["Teal", "Burgundy", "Charcoal"],
  Microfibre: ["Cream", "Slate", "Sage"],
  "Sheesham Wood": ["Natural", "Espresso", "Oak"],
  "Solid Wood": ["Oak", "Walnut", "Maple"],
  Boucle: ["Cream", "Blush", "Stone"],
  "Engineered Wood": ["Mango", "Grey", "White"],
  Other: ["Black", "White", "Beige"],
};

function Customize() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [picUrl, setPicUrl] = useState("");
  const [dimension, setDimension] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      let loaded = null;
      try {
        loaded = await fetchProductById(id);
      } catch {
        loaded = getStaticProductById(id) || null;
      }
      if (!cancelled) {
        setProduct(loaded);
        setLoading(false);
      }
    }

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!product) return;

    setName(product.name);
    setPicUrl(product.image || "");
    setDimension("");
    setMaterial(product.material || "Other");
    const availableColors = COLOR_OPTIONS_BY_MATERIAL[product.material] || COLOR_OPTIONS_BY_MATERIAL.Other;
    setColor(availableColors[0]);
    setSaved(false);
  }, [product]);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading customization details...</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section">
        <div className="container product-not-found">
          <h2>Product not found</h2>
          <p>The product you selected is unavailable for customization.</p>
          <button className="btn btn-primary" onClick={() => navigate("/products")}>Back to Products</button>
        </div>
      </section>
    );
  }

  const availableColors = COLOR_OPTIONS_BY_MATERIAL[material] || COLOR_OPTIONS_BY_MATERIAL.Other;
  const canSubmit = name.trim() && picUrl.trim() && dimension.trim() && material.trim() && color.trim();

  function handleMaterialChange(event) {
    const nextMaterial = event.target.value;
    setMaterial(nextMaterial);
    const nextColors = COLOR_OPTIONS_BY_MATERIAL[nextMaterial] || COLOR_OPTIONS_BY_MATERIAL.Other;
    if (!nextColors.includes(color)) {
      setColor(nextColors[0]);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;
    setSaved(true);
  }

  return (
    <section className="section customize-page">
      <div className="container">
        <p className="breadcrumb">
          <Link to="/products">Products</Link> / <Link to={`/products/${product.id}`}>{product.name}</Link> / <span>Customize</span>
        </p>

        <div className="customize-grid">
          <div className="customize-panel">
            <h2 className="section-title">Customize Your Furniture</h2>
            <p className="customize-intro">
              Personalize this {product.category.toLowerCase()} using the product details below,
              then choose the material and color that match your style.
            </p>

            <div className="product-card-summary">
              <img src={product.image} alt={product.name} />
              <div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p><strong>Base material:</strong> {product.material}</p>
                <p><strong>Price:</strong> NPR {product.price.toLocaleString()}</p>
              </div>
            </div>

            <form className="customize-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="furniture-name">Furniture Type</label>
                <input
                  id="furniture-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter furniture name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="furniture-pic">Picture URL</label>
                <input
                  id="furniture-pic"
                  type="url"
                  value={picUrl}
                  onChange={(e) => setPicUrl(e.target.value)}
                  placeholder="Paste an image URL for your design"
                />
              </div>

              <div className="form-group">
                <label htmlFor="furniture-dimension">Dimension</label>
                <input
                  id="furniture-dimension"
                  type="text"
                  value={dimension}
                  onChange={(e) => setDimension(e.target.value)}
                  placeholder="E.g. 180cm L × 85cm W × 90cm H"
                />
              </div>

              <div className="form-group">
                <label htmlFor="furniture-material">Material</label>
                <select id="furniture-material" value={material} onChange={handleMaterialChange}>
                  {Object.keys(COLOR_OPTIONS_BY_MATERIAL).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="furniture-color">Color</label>
                <select id="furniture-color" value={color} onChange={(e) => setColor(e.target.value)}>
                  {availableColors.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <p className="color-note">
                  Color selection is limited by the material choice above.
                </p>
              </div>

              <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
                {saved ? "Customization Saved" : "Save Custom Design"}
              </button>
            </form>
          </div>

          <aside className="customize-preview">
            <h3>Preview</h3>
            <div className="preview-card">
              <div className="preview-image">
                {picUrl ? (
                  <img src={picUrl} alt="Custom furniture preview" />
                ) : (
                  <div className="preview-placeholder">Preview will appear here</div>
                )}
              </div>
              <div className="preview-details">
                <p><strong>Type:</strong> {name || "Your furniture type"}</p>
                <p><strong>Dimension:</strong> {dimension || "Not specified"}</p>
                <p><strong>Material:</strong> {material}</p>
                <p><strong>Color:</strong> {color}</p>
              </div>
            </div>

            {saved && (
              <div className="customize-success">
                <h4>Design ready</h4>
                <p>Your custom furniture design has been saved locally for this session.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Customize;
