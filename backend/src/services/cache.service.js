const pool = require("../config/db");
const crypto = require("crypto");

// Generate a unique ID from article URL
const generateArticleId = (url) => {
  return crypto.createHash("md5").update(url).digest("hex");
};

// Cache articles into DB
const cacheArticles = async (articles, category = "general", country = "US") => {
  for (const article of articles) {
    if (!article.url || !article.title) continue; // skip invalid

    const articleId = generateArticleId(article.url);

    await pool.query(
        `INSERT INTO articles 
          (article_id, title, description, url, image_url, source, category, country, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (article_id) DO UPDATE SET
           cached_at = NOW(),
           category = EXCLUDED.category`,
        [
          articleId,
          article.title,
          article.description || null,
          article.url,
          article.urlToImage || null,
          article.source?.name || null,
          category,
          country,
          article.publishedAt ? new Date(article.publishedAt) : null,
        ]
    );
  }
};

// Get cached articles from DB by category
const getCachedArticles = async (category = "general") => {
  const result = await pool.query(
    `SELECT * FROM articles 
     WHERE category = $1 
     ORDER BY published_at DESC 
     LIMIT 20`,
    [category]
  );
  return result.rows;
};

// Get cached articles by keyword search
const searchCachedArticles = async (keyword) => {
  const result = await pool.query(
    `SELECT * FROM articles
     WHERE title ILIKE $1 OR description ILIKE $1
     ORDER BY published_at DESC
     LIMIT 20`,
    [`%${keyword}%`]
  );
  return result.rows;
};

// Check if cache is fresh (within last 5 minutes)
const isCacheFresh = async (category) => {
  const result = await pool.query(
    `SELECT COUNT(*) as count FROM articles 
     WHERE category = $1 
     AND cached_at > NOW() - INTERVAL '5 minutes'`,
    [category]
  );

  const count = parseInt(result.rows[0].count);
  console.log(`🔍 Cache check [${category}]: ${count} fresh articles`);
  return count > 0;
};

module.exports = {
  cacheArticles,
  getCachedArticles,
  searchCachedArticles,
  isCacheFresh,
  generateArticleId,
};