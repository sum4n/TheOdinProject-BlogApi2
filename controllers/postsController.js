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
