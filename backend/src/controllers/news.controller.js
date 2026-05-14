const { fetchTopHeadlines, fetchByKeyword } = require("../services/newsapi.service");
const {
  cacheArticles,
  getCachedArticles,
  searchCachedArticles,
  isCacheFresh,
} = require("../services/cache.service");

// GET /api/news?category=tech
const getNews = async (req, res) => {
  const category = req.query.category || "general";

  try {
    const fresh = await isCacheFresh(category);

    if (fresh) {
      // Serve from cache
      console.log(`📦 Serving [${category}] from cache`);
      const articles = await getCachedArticles(category);
      return res.json({ source: "cache", articles });
    }

    // Fetch fresh from NewsAPI
    console.log(`🌐 Fetching [${category}] from NewsAPI`);
    const articles = await fetchTopHeadlines(category);
    await cacheArticles(articles, category);

    const cached = await getCachedArticles(category);
    return res.json({ source: "newsapi", articles: cached });

  } catch (err) {
    console.error("getNews error:", err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

// GET /api/news/search?q=keyword
const searchNews = async (req, res) => {
  const keyword = req.query.q;

  if (!keyword) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    // First search in cache
    const cached = await searchCachedArticles(keyword);

    if (cached.length > 0) {
      console.log(`📦 Search [${keyword}] served from cache`);
      return res.json({ source: "cache", articles: cached });
    }

    // Fallback to NewsAPI
    console.log(`🌐 Search [${keyword}] fetching from NewsAPI`);
    const articles = await fetchByKeyword(keyword);
    await cacheArticles(articles, "search");

    const results = await searchCachedArticles(keyword);
    return res.json({ source: "newsapi", articles: results });

  } catch (err) {
    console.error("searchNews error:", err.message);
    res.status(500).json({ error: "Failed to search news" });
  }
};

module.exports = { getNews, searchNews };