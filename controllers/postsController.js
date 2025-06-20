const prisma = require("../config/prismaClient");
const asyncHandler = require("express-async-handler");

exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      comments: true,
    },
  });

  res.status(200).json({ posts });
});

exports.getPostById = asyncHandler(async (req, res) => {
  const postId = Number(req.params.postId);
  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
      comments: true,
    },
  });

  if (!post) {
    return res.status(404).json({ error: `Post with ID ${postId} not found` });
  }

  res.status(200).json({ post });
});
