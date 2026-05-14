const { Server } = require("socket.io");
const { fetchTopHeadlines } = require("../services/newsapi.service");
const { cacheArticles, isCacheFresh } = require("../services/cache.service");

const CATEGORIES = ["technology", "sports", "business", "health", "science", "entertainment"];
const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_URL || "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:5500", // 👈 VS Code Live Server
      ];

      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });
  });

  // Start background polling job
  startPollingJob();

  return io;
};

// Background job — runs every 5 minutes
const startPollingJob = () => {
  console.log("🔄 Background polling job started");

  setInterval(async () => {
    console.log("🔄 Polling NewsAPI for new articles...");

    let totalNew = 5;

    // for (const category of CATEGORIES) {
    //   try {
    //     const fresh = await isCacheFresh(category);

    //     if (!fresh) {
    //       const articles = await fetchTopHeadlines(category);
    //       await cacheArticles(articles, category);
    //       totalNew += articles.length;
    //       console.log(`✅ Refreshed [${category}]: ${articles.length} articles`);
    //     } else {
    //       console.log(`⏭️  Skipping [${category}]: cache still fresh`);
    //     }

    //   } catch (err) {
    //     console.error(`❌ Polling error for [${category}]:`, err.message);
    //   }
    // }

    // Notify all connected clients if new articles were fetched
    if (totalNew > 0 && io) {
      io.emit("new_articles", {
        message: `New articles available — Refresh`,
        count: totalNew,
        timestamp: new Date().toISOString(),
      });
      console.log(`📡 Notified clients: ${totalNew} new articles available`);
    }

  }, POLL_INTERVAL);
};

// Export io instance for use in other files if needed
const getIO = () => io;

module.exports = { initSocket, getIO };