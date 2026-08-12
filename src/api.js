const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const getCustomizationOptions = (productId) => api(`/customization/products/${productId}/options`);
export const createOrder = (payload) => api("/orders", { method: "POST", body: JSON.stringify(payload) });
export const getMyOrders = () => api("/orders/my");
export const getTracking = (orderNumber) => api(`/tracking/orders/${orderNumber}`);
export const initiateKhalti = (orderId, paymentType = "advance") =>
  api("/payments/khalti/initiate", { method: "POST", body: JSON.stringify({ order_id: orderId, payment_type: paymentType }) });
export const initiateEsewa = (orderId, paymentType = "advance") =>
  api("/payments/esewa/initiate", { method: "POST", body: JSON.stringify({ order_id: orderId, payment_type: paymentType }) });
