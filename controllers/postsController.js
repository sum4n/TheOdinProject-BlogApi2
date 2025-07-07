const prisma = require("../config/prismaClient");
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");

const validatePost = [
  body("title")
    .trim()
    .isLength({ min: 4, max: 200 })
    .withMessage("Must be between 4 and 200 characters"),
  body("content")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content must be more than 10 characters"),
];

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

exports.createPost = [
  validatePost,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), input: req.body });
    }

    const { title, content } = req.body;
    const post = await prisma.post.create({
      data: { title, content, authorId: req.user.id },
    });

    res.status(201).json({ message: "Post created successfully.", post });
  }),
];

exports.updatePostById = [
  validatePost,
  asyncHandler(async (req, res) => {
    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), input: req.body });
    }

    const { title, content } = req.body;

    try {
      const post = await prisma.post.update({
        where: { id: postId, authorId: req.user.id },
        data: { title, content },
      });

      res
        .status(200)
        .json({ message: `Post with ID: ${postId} updated`, post });
    } catch (err) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: "Post not found" });
      }
      // give asynchandler the error
      throw err;
    }
  }),
];

exports.updatePostPublishById = asyncHandler(async (req, res) => {
  const postId = Number(req.params.postId);
  if (isNaN(postId)) {
    return res.status(400).json({ success: false, error: "Invalid post ID" });
  }

  const { published } = req.body;
  if (typeof published !== "boolean") {
    return res
      .status(400)
      .json({ success: false, error: "`published` must be a boolean" });
  }

  try {
    const post = await prisma.post.update({
      where: { id: postId, authorId: req.user.id },
      data: { published: published },
    });
    res.status(200).json({
      success: true,
      message: `Post with ID: ${postId} is published. ${post.published}`,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    // give asynchandler the error
    throw err;
  }
});

exports.deletePostById = asyncHandler(async (req, res) => {
  const postId = Number(req.params.postId);
  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    await prisma.post.delete({
      where: { id: postId, authorId: req.user.id },
    });

    res.status(200).json({ message: `Post with ID: ${postId} deleted` });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }
    throw err;
  }
});
