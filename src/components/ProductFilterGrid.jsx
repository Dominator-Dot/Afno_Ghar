import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { getCategories, getMaterials } from "../data/products";
import "./ProductFilterGrid.css";

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under NPR 25,000", min: 0, max: 25000 },
  { label: "NPR 25,000 - 50,000", min: 25000, max: 50000 },
  { label: "Over NPR 50,000", min: 50000, max: Infinity },
];

/*
  This component takes a full list of products and renders:
    1. A search box to filter by product name
    2. A row of category filter tabs (ALL / SOFAS / BEDS / ...)
    3. Material + price-range dropdown filters
    4. A grid of <ProductCard /> for whichever filters are active

  All filtering happens client-side on the `products` prop, which
  keeps this component reusable for both the Home page ("Featured
  Products") and the full Products page. Set showAdvancedFilters
  to false to hide the material/price dropdowns (e.g. on Home).
*/
function ProductFilterGrid({
  products,
  showAdvancedFilters = true,
  categories: categoriesProp,
  materials: materialsProp,
}) {
  // Categories/materials can be passed in explicitly -- this matters once
  // `products` comes from the backend instead of the static demo data,
  // since the tabs/dropdowns need to reflect whatever list is actually
  // being shown rather than always the local src/data/products.js set.
  const categories = categoriesProp || getCategories();
  const materials = materialsProp || getMaterials();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMaterial, setActiveMaterial] = useState("All");
  const [activePriceRange, setActivePriceRange] = useState(0);

  const visibleProducts = useMemo(() => {
    const range = PRICE_RANGES[activePriceRange];
    return products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesMaterial =
        activeMaterial === "All" || product.material === activeMaterial;
      const matchesPrice =
        product.price >= range.min && product.price <= range.max;
      return matchesSearch && matchesCategory && matchesMaterial && matchesPrice;
    });
  }, [products, searchTerm, activeCategory, activeMaterial, activePriceRange]);

  return (
    <div>
      {/* Search Box */}
      {showAdvancedFilters && (
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {/* Category Tabs */}
      <div className="filter-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-tab ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="filter-dropdowns">
          <label>
            Material
            <select
              value={activeMaterial}
              onChange={(e) => setActiveMaterial(e.target.value)}
            >
              {materials.map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </label>

          <label>
            Price
            <select
              value={activePriceRange}
              onChange={(e) => setActivePriceRange(Number(e.target.value))}
            >
              {PRICE_RANGES.map((range, index) => (
                <option key={range.label} value={index}>
                  {range.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Products Grid */}
      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      {/* No Products Message */}
      {visibleProducts.length === 0 && (
        <p className="no-products">No products match these filters. Try adjusting your search or filters.</p>
      )}
    </div>
  );
}

export default ProductFilterGrid;
