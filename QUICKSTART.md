# 🚀 Quick Start - AfnoGhar Frontend

## Prerequisites
- Node.js 18+ installed
- npm installed

## Setup & Run

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Backend & Frontend Together
```bash
npm run dev:full
```

This automatically:
- ✅ Starts backend server on `http://localhost:5000`
- ✅ Starts frontend on `http://localhost:5173`
- ✅ Creates/updates `users.json` for user storage

### Step 3: Open in Browser
Navigate to: `http://localhost:5173`

---

## Test the Complete Flow

### 1. **Sign Up**
- Click "Sign In" in navbar
- Switch to "Sign Up" tab
- Fill in name, email, password
- Click "Create Account"
- ✅ You'll be redirected to Products page
- ✅ User data saved in `users.json`

### 2. **Browse Products**
- Search by product name
- Filter by category, material, price
- Add items to wishlist (❤️)
- Add to cart

### 3. **Checkout**
- Go to cart
- Fill delivery info
- Choose payment method
- Place order ✅

### 4. **Leave Reviews**
- Click on any product
- Scroll to reviews section
- Click "Leave a Review"
- Rate and comment ✅

### 5. **Log Out & Log Back In**
- Click logout in navbar
- Go to Sign In
- Use same email/password to login ✅
- Redirected to Products page

---

## Project Structure

```
afnoghar-frontend/
├── src/
│   ├── components/        (React components)
│   ├── pages/             (Page components)
│   ├── context/           (Auth, Cart, Wishlist)
│   ├── api/               (API client)
│   ├── data/              (Mock products data)
│   └── main.jsx           (Entry point)
├── server.js              (Backend server)
├── users.json             (User storage - auto-created)
├── .env                   (API configuration)
└── package.json           (Dependencies)
```

---

## Running Parts Separately

### Frontend Only (Demo Mode)
If you want to test without backend:
```bash
npm run dev
```
The app will work in demo mode (data stored in localStorage)

### Backend Only
```bash
npm run server
```
Backend runs independently on `http://localhost:5000/api`

---

## Key Features Implemented

✅ User Authentication (Sign Up & Login)
✅ Product Browsing & Filtering
✅ Product Search
✅ Wishlist (with heart ❤️)
✅ Shopping Cart
✅ Checkout with Delivery Info
✅ Product Reviews & Ratings
✅ Home Page Scrolling with Nav Highlighting

---

## Troubleshooting

### Port 5000 Already in Use?
```bash
# On Windows
netstat -ano | findstr :5000

# On macOS/Linux
lsof -i :5000
```
Kill the process or use a different port in `.env`

### Frontend Can't Connect to Backend?
1. Check backend is running: `http://localhost:5000/api/health`
2. Verify `.env` file exists with correct URL
3. Check browser console for errors

### Users Not Saving?
- Make sure `users.json` exists in root directory
- Check server console for error messages

---

## Next: Backend Integration for Production

Once ready to deploy:
1. Set up real database (MongoDB, PostgreSQL)
2. Implement password hashing (bcrypt)
3. Generate secure JWT tokens
4. Deploy backend to cloud (Heroku, AWS, etc.)
5. Update `.env` to production API URL

See `BACKEND_SETUP.md` for detailed backend documentation.

---

Happy coding! 🎉
