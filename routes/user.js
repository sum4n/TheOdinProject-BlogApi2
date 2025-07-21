const { Router } = require("express");
const router = Router();

const { authenticateJWT } = require("../middlewares/jwtAuthMiddleware");

const userController = require("../controllers/userController");

router.get("/user/", authenticateJWT, userController.getUser);

module.exports = router;
