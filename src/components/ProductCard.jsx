import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "./ProductCard.css";

/*
  This component receives one "product" object as a prop and
  renders a single card. It is reused on both the Home page
  (Featured Products) and the Products page (full catalogue),
  so we only had to write this markup once.
*/
function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  function handleAddToCart() {
    addToCart(product, quantity);
  }

  function handleWishlistToggle() {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-wrap">
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <img src={product.image} alt={product.name} />
        <div className="hover-description">
          <p>{product.description}</p>
        </div>
        <button
          className={`wishlist-btn ${inWishlist ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            handleWishlistToggle();
          }}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {inWishlist ? "❤" : "🤍"}
        </button>
      </Link>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <span className="product-price">
            NPR {product.price.toLocaleString()}
          </span>

          <div className="product-actions">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="quantity-input"
            />
            <button className="btn-add" onClick={handleAddToCart}>
              🛍 Add
            </button>
            {user && (
              <button
                type="button"
                className="btn btn-tertiary"
                onClick={() => navigate(`/products/${product.id}/customize`)}
              >
                Customize
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
