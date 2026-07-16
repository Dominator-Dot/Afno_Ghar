/*
  API CLIENT
  ----------
  This is the single place that knows HOW to talk to the backend.
  Right now there is no backend running, so every request below
  will fail with a network error — that is expected. The point of
  this file is to have the *connection wired up correctly* so that
  once a real backend exists, the only thing that needs to change
  is VITE_API_BASE_URL (in a .env file), nothing in the components.

  Example .env for local development once a backend exists:
    VITE_API_BASE_URL=http://localhost:5000/api
*/

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/*
  A small wrapper around fetch() that:
    - always sends/receives JSON
    - attaches the saved auth token (if any) as a Bearer header
    - throws a normal JS Error with a readable message on failure,
      so calling code can just try/catch it
*/
export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };

  const authToken = token || localStorage.getItem("afnoghar_token");
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    // Happens when the backend isn't running / unreachable.
    const err = new Error(
      "Could not reach the server. The backend for this project hasn't been built yet."
    );
    err.isNetworkError = true;
    err.cause = networkError;
    throw err;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Response had no JSON body (fine for some endpoints)
  }

  if (!response.ok) {
    const message = data?.message || `Request failed (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}
