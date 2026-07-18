# AfnoGhar API Documentation

## What this is
This file explains how the app talks to the backend server. It uses very simple words so even a 5-year-old can understand.

## Folder structure for APIs
- `api/`
  - `api/lib/users.js` - helper functions that read and write user data.
  - `api/routes/auth.js` - routes for login, signup, and current user.
  - `api/routes/health.js` - a tiny route to check if the backend is working.
- `server.js` - the server entrypoint that connects the routes.

## What each API does

### 1. Sign Up - `/api/auth/signup`
- Used by: `src/api/authApi.js` and `src/context/AuthContext.jsx`
- What it does: makes a new user account.
- What it needs: `name`, `email`, and `password`.
- What it returns: the new user info plus a secret token.

### 2. Login - `/api/auth/login`
- Used by: `src/api/authApi.js` and `src/context/AuthContext.jsx`
- What it does: checks that an existing user can log in.
- What it needs: `email` and `password`.
- What it returns: the user info and a token.

### 3. Get current user - `/api/auth/me`
- Used by: `src/api/authApi.js` and `src/context/AuthContext.jsx`
- What it does: asks the server who is logged in now.
- What it needs: a secret token in the request header.
- What it returns: the logged-in user info.

### 4. Health check - `/api/health`
- Used by: nobody in the frontend yet, but useful for testing.
- What it does: says "hello, I am working." 
- What it returns: `{ status: "ok" }`.

## How the frontend uses these APIs
- `src/api/client.js` sends the request to the backend.
- `src/api/authApi.js` defines the exact request shape for signup, login, and current user.
- `src/context/AuthContext.jsx` calls `authApi.signup()` and `authApi.login()` so the app can remember who is logged in.
- `src/pages/SignIn.jsx` is the page where the user types their email and password.

## How the backend stores users
- It stores users in `users.json`.
- `api/lib/users.js` reads from and writes to `users.json`.
- The password is saved as plain text in this demo project. In a real app, we would hide it better.

## Why this is helpful
- The frontend only knows how to ask for things.
- The backend only knows how to answer.
- This makes the app easier to change later.

## Example story for a 5-year-old
1. You type your name and secret word on the Sign In page.
2. The app sends that to the backend server like a letter.
3. The backend checks if the letter is okay.
4. If it is okay, the backend sends back a token and your name.
5. Your browser keeps the token and says "I am logged in!" so you can use the shop.

## Files involved
- Frontend: `src/api/client.js`, `src/api/authApi.js`, `src/context/AuthContext.jsx`, `src/pages/SignIn.jsx`
- Backend: `server.js`, `api/lib/users.js`, `api/routes/auth.js`, `api/routes/health.js`
