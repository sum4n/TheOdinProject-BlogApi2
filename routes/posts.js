const { Router } = require("express");
const router = Router();

const {
  authenticateJWT,
  requireAdmin,
} = require("../middlewares/jwtAuthMiddleware");

const postsController = require("../controllers/postsController");

router.get("/posts", postsController.getPublishedPosts);
router.get("/admin/posts", postsController.getAllPosts);
router.post(
  "/posts",
  authenticateJWT,
  requireAdmin,
  postsController.createPost
);
router.get("/posts/:postId", postsController.getPostById);
router.put(
  "/posts/:postId",
  authenticateJWT,
  requireAdmin,
  postsController.updatePostById
);
router.put(
  "/posts/:postId/publish",
  authenticateJWT,
  requireAdmin,
  postsController.updatePostPublishById
);
router.delete(
  "/posts/:postId",
  authenticateJWT,
  requireAdmin,
  postsController.deletePostById
);

module.exports = router;
