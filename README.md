# Afno_Ghar Backend

This repository contains the Afno Ghar backend API built with Express, PostgreSQL, and MVC-style controllers and views.

## Features
- User signup and login with JWT authentication
- Product listing and CRUD endpoints
- EJS views for a simple browser-accessible home page and authentication pages
- Database schema and initialization script for PostgreSQL

## Setup
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Create a `.env` file in the repository root with the database and JWT settings:
   ```env
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=Afno_Ghar
   JWT_SECRET=your_super_secret_value
   ```
3. Initialize the database schema:
   ```powershell
   npm run init-db
   ```
4. Start the server:
   ```powershell
   npm start
   ```

## Running in development
```powershell
npm run dev
```

## API Endpoints
- `GET /` - Home page with API information and product list
- `GET /health` - Health check endpoint
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate and receive a JWT token
- `GET /api/auth/me` - Get the logged-in user's profile
- `GET /api/products` - List products
- `GET /api/products/:id` - Get a single product by ID
- `POST /api/products` - Create a product (requires `Authorization: Bearer <token>`)
- `PUT /api/products/:id` - Update a product (requires auth)
- `DELETE /api/products/:id` - Delete a product (requires auth)

## Notes
- The home page is rendered using EJS and can be used to view products and interact with the backend.
- Use the `scripts/initDb.js` helper to create `users` and `products` tables automatically.
