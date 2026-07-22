import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RENTALS_FILE = path.join(__dirname, "../rentals.json");

export async function loadRentals() {
  try {
    const data = await fs.readFile(RENTALS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveRentals(rentals) {
  await fs.writeFile(RENTALS_FILE, JSON.stringify(rentals, null, 2), "utf-8");
}
