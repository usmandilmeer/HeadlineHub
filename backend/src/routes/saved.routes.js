const router = require("express").Router();
const {
  getSavedArticles,
  saveArticle,
  unsaveArticle,
  checkSaved,
} = require("../controllers/saved.controller");
const { protect } = require("../middleware/auth");

// All saved routes are protected
router.use(protect);

router.get("/", getSavedArticles);
router.post("/", saveArticle);
router.delete("/:article_id", unsaveArticle);
router.get("/check/:article_id", checkSaved);

module.exports = router;