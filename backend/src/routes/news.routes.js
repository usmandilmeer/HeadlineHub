const router = require("express").Router();
const { getNews, searchNews } = require("../controllers/news.controller");

router.get("/", getNews);
router.get("/search", searchNews);

module.exports = router;