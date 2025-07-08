const asyncHandler = require("express-async-handler");
const prisma = require("../config/prismaClient");

const { body, validationResult } = require("express-validator");

const validateComment = [
  body("content")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Comment must be more than 4 characters"),
];

exports.getAllCommentsByPostId = asyncHandler(async (req, res) => {
  const postId = Number(req.params.postId);
  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  const allCommentsByPostId = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
    include: {
      author: {
        select: {
          email: true,
          name: true,
        },
      },
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

exports.createComment = [
  validateComment,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
        input: req.body,
      });
    }

    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid postId" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res
        .status(404)
        .json({ error: `Post not found with ID: ${postId}` });
    }

    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        postId: postId,
        authorId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  }),
];

exports.updateCommentById = [
  validateComment,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), input: req.body });
    }

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
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ error: "Not Authorized" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: req.body.content },
    });

    res.status(200).json({
      message: `Comment with ID: ${commentId} updated`,
      comment: updatedComment,
    });
  }),
];

exports.deleteCommentById = asyncHandler(async (req, res) => {
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
  if (comment.authorId !== req.user.id) {
    return res.status(403).json({ error: "Not Authorized" });
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  res.status(200).json({
    message: `Comment with ID: ${commentId} deleted`,
  });
});
