import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (productId) => {
    navigate(`/product/${productId}`, { state: { action: 'buy' } });
  };

  const handleAddToCart = (productId) => {
    // Add to cart logic
    console.log('Added to cart:', productId);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Sidebar Filters */}
        <aside className="products-sidebar">
          <h3>Filters</h3>
          
          <div className="filter-group">
            <label>Category</label>
            <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})}>
              <option value="all">All Categories</option>
              <option value="sofas">Sofas</option>
              <option value="chairs">Chairs</option>
              <option value="tables">Tables</option>
              <option value="beds">Beds</option>
              <option value="cabinets">Cabinets</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select value={filters.priceRange} onChange={(e) => setFilters({...filters, priceRange: e.target.value})}>
              <option value="all">All Prices</option>
              <option value="0-5000">Under ₹5,000</option>
              <option value="5000-15000">₹5,000 - ₹15,000</option>
              <option value="15000-30000">₹15,000 - ₹30,000</option>
              <option value="30000+">₹30,000+</option>
            </select>
          </div>
        </aside>

        {/* Main Products Area */}
        <main className="products-main">
          {/* View Toggle & Header */}
          <div className="products-header">
            <h2>Product Catalog</h2>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <span>⊞⊞</span>
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <span>≡</span>
              </button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  viewMode="grid"
                  onBuyNow={() => handleBuyNow(product.id)}
                  onAddToCart={() => handleAddToCart(product.id)}
                />
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="products-list">
              {products.map(product => (
                <div key={product.id} className="product-list-item">
                  <div className="product-list-image">
                    <img src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} />
                  </div>
                  <div className="product-list-info">
                    <h3>{product.name}</h3>
                    <p className="product-list-description">{product.description}</p>
                    <div className="product-list-details">
                      <span className="price">₹{product.price}</span>
                      {product.rental_available && (
                        <span className="rental-badge">Rental Available</span>
                      )}
                    </div>
                  </div>
                  <div className="product-list-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleBuyNow(product.id)}
                    >
                      Buy Now
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {products.length === 0 && (
            <div className="no-products">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
