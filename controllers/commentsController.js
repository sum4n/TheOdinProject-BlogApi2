const asyncHandler = require("express-async-handler");
const prisma = require("../config/prismaClient");

exports.getAllCommentsByPostId = asyncHandler(async (req, res) => {
  const postId = Number(req.params.postId);
  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  const allCommentsByPostId = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
  });

  res.status(200).json({ allCommentsByPostId });
});

exports.getCommentById = asyncHandler(async (req, res) => {
  const postId = Number(req.params.postId);
  const commentId = Number(req.params.commentId);

  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }
  if (isNaN(commentId)) {
    return res.status(400).json({ error: "Invalid comment ID" });
  }

  const comment = await prisma.comment.findFirst({
    where: { id: commentId, postId },
  });

  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  res.status(200).json({ comment });
});
