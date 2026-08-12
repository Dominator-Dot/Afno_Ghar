const crypto = require("crypto");

function createSignatureFromFields(data, fieldNames, secret = process.env.ESEWA_SECRET_KEY) {
  if (!secret) throw new Error("ESEWA_SECRET_KEY is required");
  const message = fieldNames.map((name) => `${name}=${data[name]}`).join(",");
  return crypto.createHmac("sha256", secret).update(message).digest("base64");
}

function secureEqualBase64(a, b) {
  try {
    const left = Buffer.from(a, "base64");
    const right = Buffer.from(b, "base64");
    return left.length === right.length && crypto.timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

function verifyResponseSignature(data) {
  const names = String(data.signed_field_names || "").split(",").map((x) => x.trim()).filter(Boolean);
  if (!names.length || !data.signature) return false;
  const expected = createSignatureFromFields(data, names);
  return secureEqualBase64(expected, data.signature);
}

function buildEsewaForm({ amount, transactionUuid, successUrl, failureUrl }) {
  const productCode = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
  const totalAmount = formatAmount(amount);
  const fields = {
    amount: totalAmount,
    tax_amount: "0",
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: productCode,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
  };
  fields.signature = createSignatureFromFields(fields, ["total_amount", "transaction_uuid", "product_code"]);
  return {
    action: process.env.ESEWA_FORM_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    fields,
  };
}

async function checkEsewaStatus({ transactionUuid, amount }) {
  const base = process.env.ESEWA_STATUS_URL || "https://uat.esewa.com.np/api/epay/transaction/status/";
  const url = new URL(base);
  url.searchParams.set("product_code", process.env.ESEWA_PRODUCT_CODE || "EPAYTEST");
  url.searchParams.set("total_amount", formatAmount(amount));
  url.searchParams.set("transaction_uuid", transactionUuid);

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error_message || "eSewa status check failed");
  return data;
}

function formatAmount(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) throw new Error("Invalid amount");
  return n.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

module.exports = { buildEsewaForm, verifyResponseSignature, checkEsewaStatus, formatAmount };
