const { Router } = require("express");
const router = Router();

const { authenticateJWT } = require("../middlewares/jwtAuthMiddleware");

const commentsController = require("../controllers/commentsController");

router.get(
  "/posts/:postId/comments",
  commentsController.getAllCommentsByPostId
);

router.get(
  "/posts/:postId/comments/:commentId",
  commentsController.getCommentById
);

router.post(
  "/posts/:postId/comments",
  authenticateJWT,
  commentsController.createComment
);

module.exports = router;
