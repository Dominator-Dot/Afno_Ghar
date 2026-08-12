function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "You do not have permission for this action" });
    }
    return next();
  };
}

module.exports = requireRoles;
