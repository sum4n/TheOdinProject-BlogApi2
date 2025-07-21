const prisma = require("../config/prismaClient");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");

const validateUser = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Password must be atleast 3 characters long"),
];

exports.signup = [
  validateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), input: req.body });
    }

    const { email, password } = req.body;
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      res
        .status(400)
        .json({ message: `User with email: ${email} already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Sanitize user, remove the password with JS Object Destructuring
    const { password: dbPassword, ...safeUser } = user;

    res.status(201).json({ message: "User created.", user: safeUser });
  }),
];

exports.login = [
  validateUser,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), input: req.body });
    }

    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info?.message || "Invalid credentials",
          user: null,
        });
      }

      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });

      return res.status(200).json({ message: "Login successful", token });
    })(req, res, next);
  },
];

exports.adminLogin = [
  validateUser,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), input: req.body });
    }

    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info?.message || "Invalid credentials",
          user: null,
        });
      }
      if (user.role !== "ADMIN") {
        return res
          .status(400)
          .json({ message: "User is not admin", user: null });
      }

      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });

      return res.status(200).json({ message: "Logged in as ADMIN", token });
    })(req, res, next);
  },
];
