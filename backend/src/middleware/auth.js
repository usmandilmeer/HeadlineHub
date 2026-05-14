const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // Read token from cookie instead of Authorization header
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated, please login" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token, please login again" });
  }
};

module.exports = { protect };