import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignIn.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignIn() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'success'|'error', text }

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.from?.pathname || "/products";

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the field's error as soon as the user starts fixing it
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const next = {};

    if (mode === "signup" && !form.name.trim()) {
      next.name = "Please enter your full name.";
    }

    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      next.password = "Password is required.";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    if (mode === "signup") {
      if (!form.confirmPassword) {
        next.confirmPassword = "Please confirm your password.";
      } else if (form.confirmPassword !== form.password) {
        next.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);

    if (!validate()) return;

    setSubmitting(true);
    const action =
      mode === "signup"
        ? signup({ name: form.name.trim(), email: form.email.trim(), password: form.password })
        : login({ email: form.email.trim(), password: form.password });

    const result = await action;
    setSubmitting(false);

    if (!result.ok) {
      setBanner({ type: "error", text: result.message });
      return;
    }

    if (result.demo) {
      setBanner({
        type: "success",
        text:
          "You're in! (Demo mode: no backend is connected yet, so this account only lives in this browser.)",
      });
    }

    // Redirect back to the page the user originally requested.
    setTimeout(() => navigate(returnPath), result.demo ? 900 : 0);
  }

  function switchMode(newMode) {
    setMode(newMode);
    setErrors({});
    setBanner(null);
  }

  return (
    <section className="section signin-page">
      <div className="container signin-wrap">
        <form className="signin-form" onSubmit={handleSubmit} noValidate>
          <div className="signin-tabs">
            <button
              type="button"
              className={`signin-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => switchMode("login")}
            >
              Log In
            </button>
            <button
              type="button"
              className={`signin-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => switchMode("signup")}
            >
              Sign Up
            </button>
          </div>

          <h2>{mode === "login" ? "Welcome Back" : "Create Your Account"}</h2>
          <p className="signin-subtitle">
            {mode === "login"
              ? "Sign in to your AfnoGhar account"
              : "Join AfnoGhar to save your cart and orders"}
          </p>

          {banner && (
            <p className={`signin-banner ${banner.type}`}>{banner.text}</p>
          )}

          {mode === "signup" && (
            <label>
              Full Name
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                autoComplete="name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>
          )}

          <label>
            Email Address
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </label>

          {mode === "signup" && (
            <label>
              Confirm Password
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </label>
          )}

          <button
            type="submit"
            className="btn btn-primary signin-btn"
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>

          <p className="signin-footer">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => switchMode("signup")}
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => switchMode("login")}
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
