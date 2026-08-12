# Afno Ghar backend patch

Copy these files into the matching folders in your project.

1. Run your original `database/schema.sql` first if the tables do not exist.
2. Run `database/feature_patch.sql` once.
3. Copy `.env.example` values into your `.env` and fill real sandbox keys.
4. Make sure package.json uses `node server.js` and `nodemon server.js`.
5. Start with `npm run dev`.

Main APIs:
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/customization/products/:id/options
- POST /api/orders
- GET /api/orders/my
- GET /api/tracking/orders/:orderNumber
- PATCH /api/tracking/:trackingId
- POST /api/payments/khalti/initiate
- GET /api/payments/khalti/callback
- POST /api/payments/esewa/initiate
- GET /api/payments/esewa/success
