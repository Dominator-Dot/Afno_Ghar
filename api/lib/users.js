import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, "../users.json");

export async function loadUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function generateToken(email) {
  return Buffer.from(`${email}:${Date.now()}`).toString("base64");
}

export function decodeToken(token) {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.split(":")[0];
  } catch {
    return null;
  }
}
