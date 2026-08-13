import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { totalItemsInCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("hero");

  const navSections = [
    { id: "hero", label: "Home" },
    { id: "our-story", label: "Our Story" },
    { id: "collections", label: "Collections" },
    { id: "featured-products", label: "Products" },
    { id: "testimonials", label: "Reviews" },
  ];

  useEffect(() => {
    if (location.pathname !== "/") return;

    const options = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
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
    const sections = document.querySelectorAll(
      "#hero, #our-story, #features, #collections, #featured-products, #testimonials"
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;

    const sectionId = location.hash.replace("#", "");
    const element = document.getElementById(sectionId);

    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [location.pathname, location.hash]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleNavClick(sectionId) {
    if (location.pathname === "/") {
      scrollToSection(sectionId);
    } else {
      navigate({ pathname: "/", hash: `#${sectionId}` });
    }
  }

  const showSignInLink = !user && location.pathname !== "/signin";

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button className="logo" type="button" onClick={() => navigate("/")}>
          <span className="logo-star">✦</span> Afno<span className="logo-accent">Ghar</span>
        </button>

        <nav className="nav-links">
          {navSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`nav-link nav-scroll-btn ${
                location.pathname === "/" && activeSection === section.id ? "active" : ""
              }`}
              onClick={() => handleNavClick(section.id)}
            >
              {section.label}
            </button>
          ))}
          {showSignInLink && (
            <button
              type="button"
              className="nav-link"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </button>
          )}
        </nav>

        <div className="navbar-actions">
          {user && (
            <span className="navbar-greeting">
              Hi, {user.name.split(" ")[0]}
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </span>
          )}
          <button type="button" className="cart-icon" onClick={() => navigate("/cart")}>
            🛍
            <span className="cart-badge">{totalItemsInCart}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
