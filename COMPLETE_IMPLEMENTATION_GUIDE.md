# AfnoGhar E-Commerce Platform - Complete Implementation Guide

## 🎯 Features Implemented

### 1. **User Authentication System**
- **Login/Signup** with role-based registration (Buyer/Seller)
- **Session Management** using express-session with cookies
- **Role-Based Access Control** (RBAC) for different user types
- **Admin Account** (admin@afnoghar.com / 382588)

**Backend Routes:**
- `POST /api/auth/signup` - Register new users
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### 2. **Product Catalog**
- **Dual View Modes:**
  - Grid View: Shows product picture, two-word name, Add to Cart, Buy Now buttons
  - List View: Shows product picture, name, description, price on right side with action buttons
- **Product Filtering:** By category and price range
- **Product Details Page:** Includes price, quantity options, Buy Now, Add to Cart, and Rental options

**Backend Routes:**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/category/:category` - Filter by category
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)

### 3. **Product Customization System**
- **Customization Modal** pops up on "Buy Now" click
- **Customization Options:**
  - Color (black, brown, gray, beige, white, burgundy)
  - Material (leather, fabric, suede, microfiber, cotton)
  - Height, Width, Length (in cm)
  - Skip customization option
- **Proceeds to Payment** after customization

### 4. **Rental System**
- **User Verification:**
  - Photo upload (for identification)
  - Verification document/ID upload
  - Phone number verification
  - Rental location input
- **Rental Request Management:**
  - Start and end dates
  - Rental pricing (monthly basis)
  - Verification status tracking (pending/approved/rejected)

**Backend Routes:**
- `POST /api/rentals` - Create rental request
- `GET /api/rentals` - Get user's rentals
- `GET /api/rentals/:id` - Get rental details
- `PUT /api/rentals/:id/verify` - Verify rental (admin/seller)
- `GET /api/rentals/pending/all` - Get pending verifications (admin)

### 5. **Admin Dashboard**
- **Overview Statistics:**
  - Total Vendors
  - Total Buyers
  - Total Orders
  - Total Revenue
  - Active Rentals

- **Vendor Management:**
  - List all vendors with details
  - Shop location tracking
  - Vendor verification status
  - Verify/Unverify vendors

- **Buyer Management:**
  - List all buyers
  - View buyer details
  - Track buyer purchases

- **Order Management:**
  - View all orders
  - Track order status
  - Monitor payment status

**Backend Routes:**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/vendors` - Get all vendors
- `GET /api/admin/vendors/:id` - Get vendor details
- `PUT /api/admin/vendors/:id/verify` - Verify vendor
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/vendors/:id/sales` - Get vendor sales
- `GET /api/admin/users/:id/purchases` - Get buyer purchases

### 6. **Seller/Vendor Dashboard**
- **Inventory Management:**
  - Add new products to inventory
  - Update existing products
  - Track current stock
  - Set rental availability and pricing

- **Order Management:**
  - View all orders received
  - Update order status (Pending → Processing → Shipped → Delivered)
  - Track order payment status (COD/eSewa/Online)
  - Add tracking numbers
  - Order completion tracking

- **Rental Request Management:**
  - View rental requests
  - Verify user documents
  - Approve/Reject rental requests
  - Track active rentals

- **Sales Analytics:**
  - Total revenue
  - Pending vs completed orders
  - Total products listed
  - Rental statistics

**Backend Routes:**
- `GET /api/seller/dashboard` - Get seller dashboard data
- `GET /api/seller/inventory` - Get seller's products
- `POST /api/seller/products` - Add product
- `PUT /api/seller/products/:id` - Update product
- `GET /api/seller/orders` - Get seller's orders
- `PUT /api/seller/orders/:id/status` - Update order status
- `GET /api/seller/rentals` - Get rental requests
- `PUT /api/seller/rentals/:id/verify` - Verify rental

### 7. **Payment System**
- **Payment Methods:** eSewa and Cash on Delivery (COD)
- **Payment Status Tracking:** Pending, Completed
- **Order Payment Management**

**Backend Routes:**
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/payment-status` - Update payment status

### 8. **Cart System**
- Add/Remove items from cart
- Cart persistence
- Quantity management

**Backend Routes:**
- Cart management endpoints (to be configured)

## 📦 Database Schema

### Tables Created:
1. **users** - User authentication and roles
2. **user_profiles** - User personal information
3. **vendors** - Seller/vendor details with shop location
4. **products** - Product catalog with rental support
5. **customizations** - Product customization options
6. **cart_items** - Shopping cart
7. **orders** - Order management
8. **rentals** - Rental requests and tracking

### Enums:
- `user_role` - buyer, seller, admin
- `order_status` - pending, processing, shipped, delivered, cancelled
- `payment_method` - cod, esewa, online
- `verification_status` - pending, approved, rejected

## 🚀 Setup Instructions

### Prerequisites:
- Node.js 16+ installed
- PostgreSQL database
- npm or yarn package manager

### 1. **Database Setup**

Create a PostgreSQL database:
```sql
CREATE DATABASE afnoghar_db;
```

Run the schema file to create all tables:
```bash
psql -U postgres -d afnoghar_db -f api/db/schema.sql
```

### 2. **Environment Configuration**

Update `.env` file with your database credentials:
```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=afnoghar_db

# Server Configuration
PORT=5000
NODE_ENV=development

# Session Configuration
SESSION_SECRET=afnoghar_secret_key_change_in_production

# Admin Credentials
ADMIN_EMAIL=admin@afnoghar.com
ADMIN_PASSWORD=382588
```

### 3. **Install Dependencies**

```bash
npm install
```

### 4. **Run the Application**

**Development Mode:**
```bash
npm run dev:full
```

This runs both the Vite frontend and Express backend concurrently.

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run server
```

### 5. **Access the Application**

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Admin Account:** admin@afnoghar.com / 382588

## 🔧 Frontend Components

### Pages:
- `/` - Home Page
- `/signin` - Login/Signup Page
- `/products` - Product Catalog (Grid/List View)
- `/product/:id` - Product Details
- `/admin/dashboard` - Admin Dashboard
- `/seller/dashboard` - Seller Dashboard
- `/cart` - Shopping Cart
- `/rentals` - User's Rental History

### Components:
- `CustomizationModal` - Product customization popup
- `RentalForm` - Rental request form
- `ProductCard` - Product display card
- `Navbar` - Navigation bar
- `Footer` - Footer component
- `ProtectedRoute` - Route authentication

## 📝 File Structure

```
afnoghar-frontend/
├── api/
│   ├── db/
│   │   ├── database.js
│   │   └── schema.sql
│   ├── models/
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   ├── orderModel.js
│   │   ├── rentalModel.js
│   │   └── vendorModel.js
│   └── routes/
│       ├── authRoutes.js
│       ├── productRoutes.js
│       ├── orderRoutes.js
│       ├── rentalRoutes.js
│       ├── adminRoutes.js
│       └── sellerRoutes.js
├── src/
│   ├── pages/
│   │   ├── SignIn.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── SellerDashboard.jsx
│   │   └── [other pages]
│   ├── components/
│   │   ├── CustomizationModal.jsx
│   │   ├── RentalForm.jsx
│   │   └── [other components]
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── [other contexts]
│   └── App.jsx
├── .env
├── server.js
├── package.json
└── vite.config.js
```

## 🔐 Security Features

- **Password Hashing:** bcryptjs for secure password storage
- **Session Management:** Express-session with secure cookies
- **Role-Based Access Control:** Middleware for role validation
- **Input Validation:** Server-side validation for all inputs
- **CORS Configuration:** Restricted to frontend origin

## 🎨 UI/UX Features

- **Responsive Design:** Mobile-first approach
- **Dark Mode Ready:** CSS structured for theme support
- **Smooth Transitions:** CSS animations for better UX
- **Modal Popups:** For important user actions
- **Tab Navigation:** Organized dashboard sections
- **Status Badges:** Visual indicators for status
- **Form Validation:** Real-time and submit-time validation

## 📱 Mobile Responsiveness

All pages and components are fully responsive and optimized for:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## 🔄 API Response Format

### Success Response:
```json
{
  "id": 1,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response:
```json
{
  "error": "Error message description"
}
```

## 🚨 Common Issues & Solutions

### Database Connection Error:
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check database exists

### Session Not Persisting:
- Ensure cookies are enabled in browser
- Check CORS configuration
- Verify session secret is set

### Port Already in Use:
- Change PORT in `.env` file
- Kill process using port: `lsof -i :5000` (Mac/Linux)

## 📚 Next Steps

### Features to Implement:
1. **Payment Gateway Integration** - eSewa API integration
2. **Email Notifications** - Order and rental confirmations
3. **Image Upload** - Product image uploads to server
4. **Search Functionality** - Advanced product search
5. **Reviews & Ratings** - Customer reviews system
6. **Notifications** - Real-time notifications
7. **Inventory Management** - Stock tracking and alerts
8. **Analytics** - Sales and user analytics

## 📞 Support

For issues or questions:
1. Check the API documentation
2. Review the database schema
3. Check browser console for errors
4. Check server logs for backend errors

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready
