const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Cookie options
const cookieOptions = {
  httpOnly: true,   // JS cannot access cookie (XSS protection)
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax",  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    // Set token in httpOnly cookie
    res.cookie("token", token, cookieOptions);

    console.log(`✅ New user registered: ${email}`);

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user);

    // Set token in httpOnly cookie
    res.cookie("token", token, cookieOptions);

    console.log(`✅ User logged in: ${email}`);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  console.log("✅ User logged out");
  res.json({ message: "Logged out successfully" });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0] });

  } catch (err) {
    console.error("getMe error:", err.message);
    res.status(500).json({ error: "Failed to get user" });
  }
};

module.exports = { register, login, logout, getMe };