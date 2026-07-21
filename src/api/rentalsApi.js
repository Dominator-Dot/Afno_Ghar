import { apiFetch } from "./client";

export function rentFurniture(data) {
  return apiFetch("/rentals", {
    method: "POST",
    body: data,
  });
}
