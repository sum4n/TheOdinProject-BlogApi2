const { Router } = require("express");
const router = Router();

const postsController = require("../controllers/postsController");

router.get("/posts", postsController.getAllPosts);

module.exports = router;
