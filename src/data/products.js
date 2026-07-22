/*
  This file is our "fake database".
  In a real project, this data would come from a backend
  server / API. For now, we keep it as a simple JavaScript
  array so it's easy to understand and easy to edit.

  Every product has the same "shape" (the same fields),
  which makes it easy to loop over them in components
  like <ProductCard /> and <ProductDetail />.

  Fields:
    - images:  gallery of photos for the detail page
    - material: fabric/wood material, used for filtering
    - stock:    how many units are available
    - reviews:  a small list of customer reviews (rating is
                derived from these via getAverageRating below)
*/

const products = [
  {
    id: 1,
    name: "Royal Teal Velvet 3-Seater",
    category: "Sofas",
    material: "Velvet",
    price: 45000,
    tag: "BESTSELLER",
    description:
      "Deep-seated comfort in rich teal velvet, solid teak frame.",
    details:
      "The Royal Teal Velvet 3-Seater brings a touch of luxury to any living room. Hand-finished solid teak legs support a high-density foam seat wrapped in soft, durable velvet upholstery. Generously proportioned for lounging, yet compact enough for city apartments.",
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80",
    ],
    reviews: [
      {
        id: 1,
        user: "Sujata R.",
        rating: 5,
        comment:
          "Beautiful colour and very comfortable. Delivery to Kathmandu was quick.",
        date: "2026-04-12",
      },
      {
        id: 2,
        user: "Bikash T.",
        rating: 4,
        comment: "Great sofa, though the velvet shows footprints easily.",
        date: "2026-03-02",
      },
    ],
  },
  {
    id: 2,
    name: "Aruba L-Sectional",
    category: "Sofas",
    material: "Microfibre",
    price: 72000,
    tag: "",
    description:
      "Spacious corner sectional with chaise, microfibre fabric.",
    details:
      "Built for family movie nights, the Aruba L-Sectional pairs a wide chaise with a supportive backrest. The stain-resistant microfibre fabric is easy to clean, and the modular base allows the chaise to sit on either side.",
    stock: 4,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
    ],
    reviews: [
      {
        id: 1,
        user: "Anita M.",
        rating: 5,
        comment: "Huge and comfy, perfect for our living room.",
        date: "2026-05-20",
      },
    ],
  },
  {
    id: 3,
    name: "Maharaja King Bed",
    category: "Beds",
    material: "Sheesham Wood",
    price: 58000,
    tag: "NEW",
    description:
      "Upholstered headboard, solid sheesham wood, king size.",
    details:
      "A statement piece for the bedroom. The Maharaja King Bed features a tall upholstered headboard and a solid sheesham wood frame known for its strength and rich grain. Comes with slatted base support, no box spring needed.",
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
    ],
    reviews: [
      {
        id: 1,
        user: "Rajesh K.",
        rating: 5,
        comment: "Solid build quality, looks even better in person.",
        date: "2026-06-01",
      },
      {
        id: 2,
        user: "Pooja S.",
        rating: 4,
        comment: "Lovely bed, assembly took a bit longer than expected.",
        date: "2026-05-15",
      },
    ],
  },
  {
    id: 4,
    name: "Harvest Dining Table",
    category: "Tables",
    material: "Solid Wood",
    price: 39000,
    tag: "",
    description:
      "Live-edge solid wood dining table, seats six comfortably.",
    details:
      "Each Harvest Dining Table is cut from a single slab, so the natural live edge and grain pattern are unique to your piece. Finished with a food-safe matte sealant that resists everyday spills and scratches.",
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
    ],
    reviews: [
      {
        id: 1,
        user: "Nabin G.",
        rating: 5,
        comment: "Gorgeous grain, exactly like the photos.",
        date: "2026-02-18",
      },
    ],
  },
  {
    id: 5,
    name: "Everest Accent Chair",
    category: "Chairs",
    material: "Boucle",
    price: 21000,
    tag: "",
    description: "Tufted accent chair, soft cream boucle fabric.",
    details:
      "The Everest Accent Chair adds a cosy, textured focal point to any corner. Deep button-tufting on soft boucle fabric, set on tapered oak legs for a warm mid-century feel.",
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80",
    ],
    reviews: [
      {
        id: 1,
        user: "Sarita L.",
        rating: 4,
        comment: "Comfy and stylish, a little smaller than I imagined.",
        date: "2026-01-22",
      },
    ],
  },
  {
    id: 6,
    name: "Sunrise Wardrobe",
    category: "Wardrobes",
    material: "Engineered Wood",
    price: 33000,
    tag: "",
    description:
      "Three-door wardrobe with mirror panel, ample storage.",
    details:
      "Practical and spacious, the Sunrise Wardrobe offers three doors, a full-length mirror panel, and adjustable interior shelving. A durable laminate finish keeps it looking fresh for years.",
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
    ],
    reviews: [
      {
        id: 1,
        user: "Kiran D.",
        rating: 5,
        comment: "So much storage space, mirror quality is great too.",
        date: "2026-03-28",
      },
    ],
  },
];

export default products;

/*
  Helper function: returns a list of unique category names,
  plus "All" at the front, so we can build the filter tabs
  (ALL / SOFAS / BEDS / TABLES ...) without typing them twice.
*/
export function getCategories() {
  const categories = products.map((product) => product.category);
  const uniqueCategories = [...new Set(categories)];
  return ["All", ...uniqueCategories];
}

/*
  Helper function: returns a list of unique material names,
  plus "All", used to build the material filter dropdown.
*/
export function getMaterials() {
  const materials = products.map((product) => product.material);
  const uniqueMaterials = [...new Set(materials)];
  return ["All", ...uniqueMaterials];
}

/*
  Helper: average rating for a product, computed from its
  reviews array. Falls back to null if there are no reviews yet.
*/
export function getAverageRating(product) {
  if (!product.reviews || product.reviews.length === 0) return null;
  const sum = product.reviews.reduce((total, r) => total + r.rating, 0);
  return sum / product.reviews.length;
}

/*
  Helper: find a product by its id. Returns undefined if not found.
  useParams() from react-router always gives us a string, so we
  convert to Number to compare safely.
*/
export function getProductById(id) {
  return products.find((product) => product.id === Number(id));
}

/*
  Helper: given a product, return up to `limit` other products
  from the same category — used for the "You may also like"
  recommendations section on the product detail page.
*/
export function getRelatedProducts(product, limit = 3) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
