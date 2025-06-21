const { Router } = require("express");
const router = Router();

const postsController = require("../controllers/postsController");

router.get("/posts", postsController.getAllPosts);
router.post("/posts", postsController.createPost);
router.get("/posts/:postId", postsController.getPostById);
router.put("/posts/:postId", postsController.updatePostById);
router.delete("/posts/:postId", postsController.deletePostById);

module.exports = router;
