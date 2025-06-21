const passport = require("../config/passport");

module.exports.authenticateJWT = passport.authenticate("jwt", {
  session: false,
});

module.exports.requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ error: "User is not ADMIN" });
  }
};
