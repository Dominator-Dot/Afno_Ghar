const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");

async function authenticateToken(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT id, full_name, email, phone, role, status
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [decoded.userId]
    );

    const user = result.rows[0];
    if (!user || user.status !== "active") {
      return res.status(401).json({ success: false, message: "Account is not available" });
    }

    req.user = user;
    req.userId = user.id;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
    return next(error);
  }
}

module.exports = authenticateToken;
