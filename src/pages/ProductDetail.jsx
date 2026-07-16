import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  getRelatedProducts,
  getAverageRating,
} from "../data/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import "./ProductDetail.css";

function Stars({ rating }) {
  if (!rating) return <span className="stars-empty">No reviews yet</span>;
  const full = Math.round(rating);
  return (
    <span className="stars" aria-label={`${rating.toFixed(1)} out of 5`}>
      {"★".repeat(full)}
      {"☆".repeat(5 - full)}
      <span className="stars-value"> {rating.toFixed(1)}</span>
    </span>
  );
}

function StarRating({ value, onChange }) {
  return (
    <div className="star-rating-input">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= value ? "active" : ""}`}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const product = getProductById(id);

  // Hooks must run unconditionally, so declare state before any
  // early return for a missing product.
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [reviews, setReviews] = useState(product?.reviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <section className="section">
        <div className="container product-not-found">
          <h2>Product not found</h2>
          <p>We couldn't find the item you're looking for.</p>
          <button className="btn btn-primary" onClick={() => navigate("/products")}>
            Back to Products
          </button>
        </div>
      </section>
    );
  }

  const gallery = product.images?.length ? product.images : [product.image];
  const rating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;
  const related = getRelatedProducts(product);

  function handleAddToCart() {
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleQuantityChange(value) {
    const next = Number(value);
    if (Number.isNaN(next) || next < 1) {
      setQuantity(1);
      return;
    }
    setQuantity(Math.min(next, product.stock));
  }

  function handleSubmitReview(e) {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);

    // Simulate API call delay
    setTimeout(() => {
      const newReview = {
        id: reviews.length + 1,
        user: user.name,
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString().split("T")[0],
      };

      setReviews([newReview, ...reviews]);
      setReviewComment("");
      setReviewRating(5);
      setShowReviewForm(false);
      setSubmittingReview(false);
    }, 500);
  }

  return (
    <section className="section product-detail-page">
      <div className="container">
        <p className="breadcrumb">
          <Link to="/products">Products</Link> / <span>{product.category}</span> /{" "}
          <span>{product.name}</span>
        </p>

        <div className="product-detail-grid">
          {/* Gallery */}
          <div className="detail-gallery">
            <div className="detail-gallery-main">
              {product.tag && <span className="product-tag">{product.tag}</span>}
              <img src={gallery[activeImage]} alt={product.name} />
            </div>
            {gallery.length > 1 && (
              <div className="detail-gallery-thumbs">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    className={`thumb-btn ${i === activeImage ? "active" : ""}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={src} alt={`${product.name} view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="product-category">{product.category}</span>
            <h1 className="detail-title">{product.name}</h1>
            <Stars rating={rating} />

            <p className="detail-price">NPR {product.price.toLocaleString()}</p>

            <p className="detail-description">{product.details || product.description}</p>

            <ul className="detail-meta">
              <li>
                <strong>Material:</strong> {product.material}
              </li>
              <li>
                <strong>Availability:</strong>{" "}
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </li>
            </ul>

            <div className="detail-actions">
              <label className="detail-qty">
                Qty
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                />
              </label>
              <button
                className="btn btn-primary detail-add-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "🛍 Add to Cart"}
              </button>
            </div>

            {justAdded && (
              <p className="added-confirmation">
                Added {quantity} × {product.name} to your cart.{" "}
                <Link to="/cart">View Cart</Link>
              </p>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="detail-reviews">
          <div className="reviews-header">
            <h2 className="section-title">Customer Reviews</h2>
            {user && (
              <button
                className="btn btn-secondary"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? "Cancel" : "Leave a Review"}
              </button>
            )}
            {!user && (
              <p className="login-prompt">
                <Link to="/signin">Sign in</Link> to leave a review
              </p>
            )}
          </div>

          {/* Review Form */}
          {user && showReviewForm && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <StarRating value={reviewRating} onChange={setReviewRating} />
              </div>

              <div className="form-group">
                <label htmlFor="comment">Your Review</label>
                <textarea
                  id="comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows="4"
                  disabled={submittingReview}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingReview || !reviewComment.trim()}
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews && reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div className="review-card" key={review.id}>
                  <div className="review-header">
                    <span className="review-user">{review.user}</span>
                    <Stars rating={review.rating} />
                  </div>
                  <p className="review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">
              {user
                ? "Be the first to review this product!"
                : "No reviews yet. Sign in to leave one!"}
            </p>
          )}
        </div>

        {/* Recommendations */}
        {related.length > 0 && (
          <div className="detail-related">
            <h2 className="section-title">You May Also Like</h2>
            <div className="related-grid">
              {related.map((item) => (
                <ProductCard product={item} key={item.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDetail;
