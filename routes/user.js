const { Router } = require("express");
const router = Router();

const { authenticateJWT } = require("../middlewares/jwtAuthMiddleware");

router.get("/user/", authenticateJWT, async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ user });
});

module.exports = router;
