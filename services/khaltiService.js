const BASE_URL = process.env.KHALTI_BASE_URL || "https://dev.khalti.com/api/v2";

async function khaltiPost(path, body) {
  if (!process.env.KHALTI_SECRET_KEY) throw new Error("KHALTI_SECRET_KEY is required");

  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || data.message || "Khalti request failed");
  return data;
}

function initiateKhaltiPayment(payload) {
  return khaltiPost("/epayment/initiate/", payload);
}

function lookupKhaltiPayment(pidx) {
  return khaltiPost("/epayment/lookup/", { pidx });
}

module.exports = { initiateKhaltiPayment, lookupKhaltiPayment };
