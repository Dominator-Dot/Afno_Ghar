# AfnoGhar E-Commerce Platform - Setup & Usage Guide

## 🎯 Project Overview

AfnoGhar is a complete e-commerce platform for buying, selling, and renting furniture with advanced features including:
- User authentication with role-based access
- Product catalog with grid/list view
- Product customization system
- Rental management with verification
- Admin & Seller dashboards
- Payment processing (eSewa & COD)

---

## 🚀 Quick Start Guide

### Prerequisites
```bash
- Node.js 16 or higher
- PostgreSQL 12 or higher
- npm or yarn
```

### Step 1: Database Setup

1. **Create Database:**
   ```bash
   psql -U postgres
   CREATE DATABASE afnoghar_db;
   \q
   ```

2. **Run Schema:**
   ```bash
   psql -U postgres -d afnoghar_db -f api/db/schema.sql
   ```

### Step 2: Environment Configuration

Create/update `.env` file:
```env
# Frontend API
VITE_API_BASE_URL=http://localhost:5000/api

# Database
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=afnoghar_db

# Server
PORT=5000
NODE_ENV=development
SESSION_SECRET=afnoghar_secret_key_change_in_production

# Admin
ADMIN_EMAIL=admin@afnoghar.com
ADMIN_PASSWORD=382588
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start Application

**Both Frontend & Backend:**
```bash
npm run dev:full
```

**Frontend Only:**
```bash
npm run dev
```

**Backend Only:**
```bash
npm run server
```

### Step 5: Access Application

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:5000/api |
| Admin Account | admin@afnoghar.com / 382588 |

---

## 📖 User Guides

### For Buyers

#### 1. **Sign Up**
- Go to `/signin`
- Click "Sign Up" tab
- Enter: Email, Password, First Name
- Select "Buyer" role
- Click "Create Account"

#### 2. **Browse Products**
- After login, go to `/products`
- Use filters by category and price
- Toggle between Grid/List view
- Click on product for details

#### 3. **Buy a Product**
- Click "Buy Now" on product
- Customize product (optional):
  - Select color, material, dimensions
  - Or skip customization
- Proceed to checkout
- Select payment method (eSewa/COD)
- Complete payment

#### 4. **Rent a Product**
- Go to product details
- Click "Rent Now"
- Fill rental form:
  - Upload your photo
  - Upload ID/Verification
  - Enter rental location
  - Select dates
- Submit request
- Wait for seller approval

#### 5. **View Orders**
- Go to `/products` and click "My Orders"
- See order status and tracking
- Track rental requests

### For Sellers

#### 1. **Sign Up as Seller**
- Go to `/signin`
- Click "Sign Up"
- Select "Seller/Vendor" role
- Fill in:
  - Name
  - Shop Name
  - Location
  - Phone
- Create account

#### 2. **Access Seller Dashboard**
- Login to seller account
- Automatically redirected to `/seller/dashboard`

#### 3. **Add Products**
- Go to "Inventory" tab
- Click "+ Add Product"
- Fill details:
  - Product name, description
  - Price, category, stock
  - Enable rental if applicable
  - Set rental price
- Click "Add Product"

#### 4. **Manage Orders**
- Go to "Orders" tab
- View incoming orders
- Update status: Pending → Processing → Shipped → Delivered
- Add tracking number
- Update payment status

#### 5. **Handle Rentals**
- Go to "Rental Requests" tab
- Review rental requests:
  - Check user photo & ID
  - Verify location & dates
- Approve or reject requests

#### 6. **View Analytics**
- Overview tab shows:
  - Total products & revenue
  - Pending & completed orders
  - Active rentals

### For Admin

#### 1. **Admin Login**
- Email: `admin@afnoghar.com`
- Password: `382588`
- Redirected to `/admin/dashboard`

#### 2. **Dashboard Overview**
- View platform statistics
- Total vendors, buyers, orders
- Total revenue and active rentals

#### 3. **Vendor Management**
- View all vendors with details
- Shop location tracking
- Verify/unverify vendors
- View vendor sales

#### 4. **Buyer Management**
- View all registered buyers
- See buyer purchase history
- Track buyer activity

#### 5. **Order Management**
- View all platform orders
- Monitor order status
- Track payment status
- View revenue reports

#### 6. **System Monitoring**
- Monitor platform activity
- Check rental verifications
- System health and statistics

---

## 🔗 API Endpoints Reference

### Authentication
```
POST   /api/auth/signup              - Register user
POST   /api/auth/login               - User login
POST   /api/auth/logout              - User logout
GET    /api/auth/me                  - Current user info
```

### Products
```
GET    /api/products                 - All products
GET    /api/products/:id             - Product details
GET    /api/products/category/:cat   - Filter by category
POST   /api/products                 - Create product (seller)
PUT    /api/products/:id             - Update product (seller)
DELETE /api/products/:id             - Delete product (seller)
```

### Orders
```
POST   /api/orders                   - Create order
GET    /api/orders                   - User's orders
PUT    /api/orders/:id/status        - Update order status
PUT    /api/orders/:id/payment-status - Update payment status
```

### Rentals
```
POST   /api/rentals                  - Create rental request
GET    /api/rentals                  - User's rentals
PUT    /api/rentals/:id/verify       - Verify rental (seller/admin)
GET    /api/rentals/pending/all      - Pending verifications (admin)
```

### Seller
```
GET    /api/seller/dashboard         - Dashboard data
GET    /api/seller/inventory         - Inventory list
POST   /api/seller/products          - Add product
PUT    /api/seller/products/:id      - Update product
GET    /api/seller/orders            - Orders list
PUT    /api/seller/orders/:id/status - Update order status
GET    /api/seller/rentals           - Rental requests
```

### Admin
```
GET    /api/admin/users              - All users
GET    /api/admin/vendors            - All vendors
PUT    /api/admin/vendors/:id/verify - Verify vendor
GET    /api/admin/orders             - All orders
GET    /api/admin/dashboard/stats    - Dashboard statistics
```

---

## 🎨 Frontend Components

### Pages
- **Home** (`/`) - Landing page
- **SignIn** (`/signin`) - Login/Signup
- **Products** (`/products`) - Product catalog with grid/list view
- **Product Detail** (`/product/:id`) - Single product details
- **Cart** (`/cart`) - Shopping cart
- **Admin Dashboard** (`/admin/dashboard`) - Admin panel
- **Seller Dashboard** (`/seller/dashboard`) - Seller panel
- **About** (`/about`) - About page
- **Contact** (`/contact`) - Contact page

### Key Components
- `CustomizationModal` - Product customization popup
- `RentalForm` - Rental request form
- `ProductCard` - Product display card
- `ProductFilterGrid` - Product filtering
- `Navbar` - Navigation
- `Footer` - Footer
- `ProtectedRoute` - Authentication guard

---

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts with roles
- `user_profiles` - User personal info
- `vendors` - Seller shop details
- `products` - Product catalog
- `customizations` - Product customization options
- `cart_items` - Shopping cart
- `orders` - Order history
- `rentals` - Rental requests

### User Roles
- **buyer** - Customer purchasing/renting
- **seller** - Vendor managing shop
- **admin** - Platform administrator

### Order Status Flow
```
pending → processing → shipped → delivered
                    ↓
                cancelled
```

---

## 🔐 Security Features

✅ Password hashing with bcryptjs  
✅ Session-based authentication  
✅ Role-based access control (RBAC)  
✅ CORS protection  
✅ Input validation  
✅ Secure session cookies  
✅ Protected routes  

---

## 📱 Responsive Design

All pages are fully responsive:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Database Connection Failed
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `psql -l`

### Session Not Persisting
- Clear browser cookies
- Check browser console for errors
- Verify `credentials: 'include'` in fetch calls

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 File Structure

```
afnoghar-frontend/
├── api/
│   ├── db/
│   │   ├── database.js          # DB connection
│   │   └── schema.sql           # Database schema
│   ├── models/                  # Data models
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   ├── orderModel.js
│   │   ├── rentalModel.js
│   │   └── vendorModel.js
│   └── routes/                  # API routes
│       ├── authRoutes.js
│       ├── productRoutes.js
│       ├── orderRoutes.js
│       ├── rentalRoutes.js
│       ├── adminRoutes.js
│       └── sellerRoutes.js
├── src/
│   ├── pages/                   # Page components
│   ├── components/              # Reusable components
│   ├── context/                 # Context providers
│   ├── api/                     # API client methods
│   ├── App.jsx                  # Main app
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── .env                         # Environment config
├── server.js                    # Express server
├── package.json                 # Dependencies
└── vite.config.js              # Vite config
```

---

## 🚀 Deployment

### Production Checklist
- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Use strong SESSION_SECRET
- [ ] Configure database backup
- [ ] Setup HTTPS/SSL
- [ ] Configure domain
- [ ] Setup email notifications
- [ ] Enable payment gateway

### Deployment Platforms
- **Frontend:** Vercel, Netlify
- **Backend:** Heroku, Railway, DigitalOcean
- **Database:** AWS RDS, Heroku Postgres

---

## 📞 Support & Feedback

For issues or feature requests:
1. Check error logs
2. Review API documentation
3. Check component props
4. Test with sample data

---

## 📝 Notes

- Admin account is created by default in schema
- Change admin password in production
- All passwords are hashed
- Sessions expire after 24 hours
- Images should be uploaded to server storage

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** ✅ Production Ready
