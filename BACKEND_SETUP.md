# AfnoGhar Backend Setup Guide

## Overview
This backend server stores user authentication data in a JSON file (`users.json`) for easy development and testing.

## Features
- ✅ User Registration (Sign Up)
- ✅ User Login
- ✅ Token-based Authentication
- ✅ User data persisted in `users.json`
- ✅ Automatic redirect to products page after login/signup

## Installation

### 1. Install Dependencies
```bash
npm install
```

This installs both frontend (React) and backend (Express, CORS) dependencies.

### 2. Run Both Frontend and Backend Together
```bash
npm run dev:full
```

This command:
- Starts the backend server on `http://localhost:5000`
- Starts the frontend (Vite) on `http://localhost:5173`
- Both run concurrently

### 3. Run Services Separately (Alternative)

**Backend only:**
```bash
npm run server
```
Server runs on `http://localhost:5000`

**Frontend only (in another terminal):**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## API Endpoints

### `POST /api/auth/signup`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "user": { "id": "123", "name": "John Doe", "email": "john@example.com" },
  "token": "eyJvbmU6dGltZXN0YW1wIg=="
}
```

### `POST /api/auth/login`
Log in an existing user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response: Same as signup

### `GET /api/auth/me`
Get current logged-in user (requires Bearer token)
```
Authorization: Bearer <token>
```

## User Data Storage

All users are stored in `users.json` in the project root.

Example structure:
```json
[
  {
    "id": "1689123456789",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "createdAt": "2026-07-16T10:30:00.000Z"
  }
]
```

## How It Works

1. **Sign Up**: 
   - User fills form → Sends to `/api/auth/signup` → Server stores in `users.json` → Returns token → Frontend redirects to `/products`

2. **Login**:
   - User fills form → Sends to `/api/auth/login` → Server finds user in `users.json` → Returns token → Frontend redirects to `/products`

3. **Persistence**:
   - Token stored in `localStorage` with key `afnoghar_token`
   - User stored in `localStorage` with key `afnoghar_user`
   - Data persists across page reloads

## Flow Diagram

```
User fills Sign Up/Login form
         ↓
    Form validation
         ↓
    POST to /api/auth/signup or /api/auth/login
         ↓
    Backend validates & checks users.json
         ↓
    ✓ Success: Return user + token
    ✗ Error: Return error message
         ↓
    Frontend stores token & user in localStorage
         ↓
    ✓ Success: Show banner → Redirect to /products
    ✗ Error: Show error banner
         ↓
    Products page checks auth
         ↓
    ✓ User logged in: Show products
    ✗ Not logged in: Redirect to /signin
```

## Important Notes

⚠️ **Security**:
- Passwords are stored in plain text (for development only!)
- In production, use bcrypt or similar to hash passwords
- Tokens should be JWTs with expiration
- Use HTTPS in production

⚠️ **File Persistence**:
- `users.json` is not tracked in git (add to `.gitignore` if needed)
- Data is lost if you delete the file
- For production, use a proper database (MongoDB, PostgreSQL, etc.)

## Troubleshooting

### Backend not starting?
- Make sure port 5000 is not in use
- Check that you've run `npm install`

### Frontend can't connect to backend?
- Check that backend is running on localhost:5000
- Verify `.env` file has `VITE_API_BASE_URL=http://localhost:5000/api`
- Check browser console for CORS errors

### Users not saving?
- Make sure `users.json` exists in project root
- Check file permissions
- Verify server has write access to the directory

## Next Steps

When ready for production:
1. Replace file storage with real database (MongoDB, PostgreSQL, etc.)
2. Implement proper password hashing (bcrypt)
3. Generate JWT tokens with expiration
4. Add email verification
5. Deploy backend to cloud service (Heroku, AWS, etc.)
6. Update API URL in `.env` to production endpoint
