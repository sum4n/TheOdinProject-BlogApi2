const { Router } = require("express");
const router = Router();

const postsController = require("../controllers/postsController");

router.get("/posts", postsController.getAllPosts);
router.get("/posts/:postId", postsController.getPostById);

module.exports = router;
