require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const createTables = require("./config/schema");
const authRoutes = require("./routes/auth.routes");
const newsRoutes = require("./routes/news.routes");
const savedRoutes = require("./routes/saved.routes");

const app = express();

// Run DB schema on startup
createTables();

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL || "http://localhost:3008",
      "http://localhost:3001",
      "http://127.0.0.1:5500", // 👈 VS Code Live Server
    ];

    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // 👈 required for cookies to work cross-origin
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/favourites", savedRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;