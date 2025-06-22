const { Router } = require("express");
const router = Router();

const commentsController = require("../controllers/commentsController");

router.get(
  "/posts/:postId/comments",
  commentsController.getAllCommentsByPostId
);

router.get(
  "/posts/:postId/comments/:commentId",
  commentsController.getCommentById
);

module.exports = router;
