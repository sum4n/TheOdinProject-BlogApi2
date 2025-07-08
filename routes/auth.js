const { Router } = require("express");
const router = Router();

const authController = require("../controllers/authController");

router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.post("/auth/admin/login", authController.adminLogin);

module.exports = router;
