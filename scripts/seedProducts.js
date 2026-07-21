// Optional helper: seeds the `products` table with the same demo
// furniture used by the frontend's src/data/products.js, so that
// once Products.jsx / ProductDetail.jsx are pointed at this backend
// (see afnoghar-frontend/src/api/productsApi.js), the catalogue
// looks the same as it did with the static local data.
//
// Run with: node scripts/seedProducts.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const products = [
  {
    name: 'Royal Teal Velvet 3-Seater',
    category: 'Sofas',
    material: 'Velvet',
    price: 45000,
    tag: 'BESTSELLER',
    description: 'Deep-seated comfort in rich teal velvet, solid teak frame.',
    details: 'The Royal Teal Velvet 3-Seater brings a touch of luxury to any living room. Hand-finished solid teak legs support a high-density foam seat wrapped in soft, durable velvet upholstery.',
    stock: 8,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    name: 'Aruba L-Sectional',
    category: 'Sofas',
    material: 'Fabric',
    price: 62000,
    tag: null,
    description: 'Roomy L-shaped sectional, ideal for family lounging.',
    details: 'A generously sized L-sectional finished in woven fabric, built on a hardwood frame with removable, washable cushion covers.',
    stock: 5,
    image_url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80',
    images: [],
  },
];

async function seed() {
  try {
    for (const p of products) {
      await pool.query(
        `INSERT INTO products (name, description, details, price, category, material, tag, stock, image_url, images)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [p.name, p.description, p.details, p.price, p.category, p.material, p.tag, p.stock, p.image_url, JSON.stringify(p.images)]
      );
    }
    console.log(`Seeded ${products.length} products.`);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
