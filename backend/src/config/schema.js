const pool = require("./db");

const createTables = async () => {
  const query = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      email      VARCHAR(150) UNIQUE NOT NULL,
      password   VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Cached articles table
    CREATE TABLE IF NOT EXISTS articles (
      id           SERIAL PRIMARY KEY,
      article_id   VARCHAR(255) UNIQUE NOT NULL,  -- hash of url
      title        TEXT NOT NULL,
      description  TEXT,
      url          TEXT NOT NULL,
      image_url    TEXT,
      source       VARCHAR(100),
      category     VARCHAR(50),
      country      VARCHAR(10),
      published_at TIMESTAMP,
      cached_at    TIMESTAMP DEFAULT NOW()
    );

    -- Saved articles per user
    CREATE TABLE IF NOT EXISTS saved_articles (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
      article_id VARCHAR(255) NOT NULL,  -- references articles.article_id
      saved_at   TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, article_id)        -- no duplicates
    );
  `;

  try {
    await pool.query(query);
    console.log("✅ Tables created successfully");
  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
  }
};

module.exports = createTables;