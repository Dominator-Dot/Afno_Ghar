import { apiFetch } from "./client";

/*
  These functions describe the CONTRACT this frontend expects
  from the backend. Nothing here works yet because there is no
  server, but the request/response shape is intentionally kept
  simple and RESTful so a backend can be dropped in later:

    POST /auth/signup   { name, email, password } -> { user, token }
    POST /auth/login     { email, password }       -> { user, token }
    GET  /auth/me         (Bearer token)             -> { user }
*/

export function signup({ name, email, password }) {
  return apiFetch("/auth/signup", {
    method: "POST",
    body: { name, email, password },
  });
}

export function login({ email, password }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function fetchCurrentUser(token) {
  return apiFetch("/auth/me", { token });
}
