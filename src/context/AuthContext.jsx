import { createContext, useContext, useEffect, useState } from "react";
import { signup as signupRequest, login as loginRequest, fetchCurrentUser } from "../api/authApi";

/*
  WHAT IS THIS FILE?
  -------------------
  Just like CartContext, this uses React Context so the Navbar,
  SignIn page, and any future "account" page can all share the
  same logged-in-user state without prop drilling.

  HOW AUTH WILL WORK ONCE A BACKEND EXISTS:
    1. User submits the sign up / login form.
    2. We call authApi.signup() / authApi.login(), which POSTs
       to the backend (see src/api/authApi.js).
    3. The backend validates + stores the user in a real database
       and replies with { user, token }.
    4. We save the token so future requests can identify the user.

  RIGHT NOW (no backend yet):
    Every real API call above will fail with a network error,
    because nothing is listening on VITE_API_BASE_URL. Rather
    than breaking the whole page, we catch that specific error
    and fall back to a "local demo mode": the account is kept
    only in this browser's localStorage, clearly flagged as
    `isDemo: true`. This keeps the UI fully testable today, and
    the moment a real backend is deployed, real accounts will be
    used automatically (the fallback only triggers on network
    failure, not on validation errors from a real server).
*/

const AuthContext = createContext();

const STORAGE_KEY = "afnoghar_user";
const TOKEN_KEY = "afnoghar_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On first load, restore any previously saved session. If there's a
  // real token (not a local demo account), re-validate it against the
  // backend's GET /api/auth/me -- previously this endpoint existed but
  // was never actually called, so a saved-but-expired/invalid token
  // would silently keep the user "logged in" until their next signup
  // or login attempt.
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const saved = localStorage.getItem(STORAGE_KEY);
      const token = localStorage.getItem(TOKEN_KEY);

      if (!saved) {
        setInitializing(false);
        return;
      }

      let savedUser;
      try {
        savedUser = JSON.parse(saved);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setInitializing(false);
        return;
      }

      // Demo accounts (created while the backend was unreachable) have
      // no token to validate -- trust localStorage as before.
      if (!token || savedUser.isDemo) {
        if (!cancelled) {
          setUser(savedUser);
          setInitializing(false);
        }
        return;
      }

      try {
        const result = await fetchCurrentUser(token);
        if (!cancelled) {
          setUser({ ...result.user, isDemo: false });
        }
      } catch (err) {
        // Network failure (backend down) -> keep working offline with
        // whatever was saved, same fallback philosophy used elsewhere.
        // An actual auth rejection (expired/invalid token) -> log out.
        if (err.isNetworkError) {
          if (!cancelled) setUser(savedUser);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TOKEN_KEY);
          if (!cancelled) setUser(null);
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  function persistSession(userData, token) {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    if (token) localStorage.setItem(TOKEN_KEY, token);
  }

  async function signup({ name, email, password }) {
    try {
      const result = await signupRequest({ name, email, password });
      const userData = { ...result.user, isDemo: false };
      persistSession(userData, result.token);
      return { ok: true, demo: false };
    } catch (err) {
      if (err.isNetworkError) {
        // No backend yet -> fall back to a local-only demo account.
        const userData = { name, email, isDemo: true };
        persistSession(userData, null);
        return { ok: true, demo: true };
      }
      // A real server responded with a real error (e.g. "email taken")
      return { ok: false, message: err.message };
    }
  }

  async function login({ email, password }) {
    try {
      const result = await loginRequest({ email, password });
      const userData = { ...result.user, isDemo: false };
      persistSession(userData, result.token);
      return { ok: true, demo: false };
    } catch (err) {
      if (err.isNetworkError) {
        // No backend yet -> let the user into a local demo session
        // using whatever name is on file for this email, if any.
        const saved = localStorage.getItem(STORAGE_KEY);
        const previous = saved ? JSON.parse(saved) : null;
        const userData = {
          name: previous?.email === email ? previous.name : email.split("@")[0],
          email,
          isDemo: true,
        };
        persistSession(userData, null);
        return { ok: true, demo: true };
      }
      return { ok: false, message: err.message };
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  const value = { user, initializing, signup, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
