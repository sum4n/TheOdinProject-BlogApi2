const asyncHandler = require("express-async-handler");
const prisma = require("../config/prismaClient");

exports.getAllCommentsByPostId = asyncHandler(async (req, res) => {
  const postId = Number(req.params.postId);
  if (isNaN(postId)) {
    res.status(400).json({ error: "Invalid post ID" });
  }

  const allCommentsByPostId = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
  });

  res.status(200).json({ allCommentsByPostId });
});
