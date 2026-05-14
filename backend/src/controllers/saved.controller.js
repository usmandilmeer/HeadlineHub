const pool = require("../config/db");
const { generateArticleId } = require("../services/cache.service");

// GET /api/saved — get all saved articles for logged in user
const getSavedArticles = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.* FROM articles a
       INNER JOIN saved_articles sa ON a.article_id = sa.article_id
       WHERE sa.user_id = $1
       ORDER BY sa.saved_at DESC`,
      [req.user.id]
    );

    res.json({ articles: result.rows });

  } catch (err) {
    console.error("getSavedArticles error:", err.message);
    res.status(500).json({ error: "Failed to fetch saved articles" });
  }
};

// POST /api/saved — save an article
const saveArticle = async (req, res) => {
  const { article_id } = req.body;

  if (!article_id) {
    return res.status(400).json({ error: "article_id is required" });
  }

  try {
    // Check article exists in cache
    const article = await pool.query(
      "SELECT id FROM articles WHERE article_id = $1",
      [article_id]
    );

    if (article.rows.length === 0) {
      return res.status(404).json({ error: "Article not found in cache" });
    }

    // Save article for user
    await pool.query(
      `INSERT INTO saved_articles (user_id, article_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, article_id) DO NOTHING`,
      [req.user.id, article_id]
    );

    console.log(`✅ Article saved for user ${req.user.id}`);
    res.status(201).json({ message: "Article saved successfully" });

  } catch (err) {
    console.error("saveArticle error:", err.message);
    res.status(500).json({ error: "Failed to save article" });
  }
};

// DELETE /api/saved/:article_id — unsave an article
const unsaveArticle = async (req, res) => {
  const { article_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM saved_articles
       WHERE user_id = $1 AND article_id = $2
       RETURNING id`,
      [req.user.id, article_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Saved article not found" });
    }

    console.log(`✅ Article unsaved for user ${req.user.id}`);
    res.json({ message: "Article removed from saved" });

  } catch (err) {
    console.error("unsaveArticle error:", err.message);
    res.status(500).json({ error: "Failed to unsave article" });
  }
};

// GET /api/saved/check/:article_id — check if article is saved
const checkSaved = async (req, res) => {
  const { article_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id FROM saved_articles
       WHERE user_id = $1 AND article_id = $2`,
      [req.user.id, article_id]
    );

    res.json({ isSaved: result.rows.length > 0 });

  } catch (err) {
    console.error("checkSaved error:", err.message);
    res.status(500).json({ error: "Failed to check saved status" });
  }
};

module.exports = { getSavedArticles, saveArticle, unsaveArticle, checkSaved };