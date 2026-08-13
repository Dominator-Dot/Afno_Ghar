import { apiFetch } from "./client";

/*
  PRODUCTS API
  ------------
  The backend (Afno_Ghar-Backend) stores products with a leaner,
  snake_case shape (image_url, created_at, etc.) than the rich demo
  objects in src/data/products.js (image, images[], tag, material,
  reviews[]...). Rather than rewrite every component that already
  expects the local shape, this file adapts each backend row into
  that same shape once, in one place.
*/
function adaptProduct(row) {
  if (!row) return row;
  return {
    id: row.id,
    name: row.name,
    category: row.category || "Uncategorized",
    material: row.material || "Other",
    price: Number(row.price),
    tag: row.tag || null,
    description: row.description || "",
    details: row.details || row.description || "",
    stock: row.stock ?? 0,
    image: row.image_url || row.image || "",
    images: Array.isArray(row.images) && row.images.length
      ? row.images
      : row.image_url
      ? [row.image_url]
      : [],
    // The backend doesn't store reviews (they're simulated client-side
    // in ProductDetail.jsx today), so this is always empty from the API.
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
  };
}

export async function fetchAllProducts() {
  const data = await apiFetch("/products");
  const rows = Array.isArray(data) ? data : data?.products || [];
  return rows.map(adaptProduct);
}

export async function fetchProductById(id) {
  const row = await apiFetch(`/products/${id}`);
  return adaptProduct(row);
}
