import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

/*
  NavLink (from react-router-dom) works like a normal <a> tag,
  but it automatically knows which page is currently active,
  so we can highlight it (see the "active" class in Navbar.css).
  
  On the home page, we use IntersectionObserver to track which
  section is currently in view and highlight it in the navbar.
*/
function Navbar() {
  const { totalItemsInCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("hero");

  // Track which section is in view using IntersectionObserver
  useEffect(() => {
    if (location.pathname !== "/") return; // Only on home page

    const options = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // Highlight when section is in middle of viewport
      threshold: 0,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    // Observe all home page sections
    const sections = document.querySelectorAll(
      "#hero, #categories, #features, #collections, #featured-products, #testimonials"
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  // Smooth scroll to a section on home page
  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  const showSignInLink = !user && location.pathname !== "/signin";

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <NavLink to="/" className="logo">
          <span className="logo-star">✦</span> Afno<span className="logo-accent">Ghar</span>
        </NavLink>

        {/* Main navigation links — render a consistent set across pages.
            Section links (Collections/Products/Reviews) will either
            scroll when already on the home page or navigate to home
            and carry a small state indicating which section to show. */}
        <nav className="nav-links">
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>

          <button
            type="button"
            className={`nav-link nav-scroll-btn ${
              (location.pathname === "/" && (activeSection === "categories" || activeSection === "collections"))
                ? "active"
                : ""
            }`}
            onClick={() => {
              if (location.pathname === "/") return scrollToSection("collections");
              navigate("/", { state: { scrollTo: "collections" } });
            }}
          >
            Collections
          </button>

          <NavLink to="/products" className="nav-link">
            Products
          </NavLink>

          <button
            type="button"
            className={`nav-link nav-scroll-btn ${
              (location.pathname === "/" && activeSection === "featured-products") ? "active" : ""
            }`}
            onClick={() => {
              if (location.pathname === "/") return scrollToSection("featured-products");
              navigate("/", { state: { scrollTo: "featured-products" } });
            }}
          >
            Reviews
          </button>

          <NavLink to="/about" className="nav-link">
            About
          </NavLink>

          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
          {showSignInLink && (
            <NavLink to="/signin" className="nav-link">
              Sign In
            </NavLink>
          )}
        </nav>

        {/* Cart icon with a small badge showing item count */}
        <div className="navbar-actions">
          {user && (
            <span className="navbar-greeting">
              Hi, {user.name.split(" ")[0]}
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </span>
          )}
          <NavLink to="/cart" className="cart-icon">
            🛍
            <span className="cart-badge">{totalItemsInCart}</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
