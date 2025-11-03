const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const { User } = require("../models");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Google OAuth routes
router.get("/google", (req, res, next) => {
  console.log("Google OAuth initiated");
  console.log("Client ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set");
  console.log("Callback URL:", process.env.GOOGLE_CALLBACK_URL);

  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("Google OAuth not configured");
    return res.status(503).json({
      error: "Google OAuth is not configured on the server",
      message: "Please contact the administrator",
      hint: "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables"
    });
  }
  
  // If configured, use passport
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error("Google OAuth callback - OAuth not configured");
      return res.redirect(
        `${
          process.env.CORS_ORIGIN || "http://localhost:3000"
        }/login?error=oauth_not_configured`
      );
    }
    next();
  },
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      console.log("Google OAuth callback - User:", req.user);

      if (!req.user) {
        console.error("No user found in request");
        return res.redirect(
          `${process.env.CORS_ORIGIN}/login?error=authentication_failed`
        );
      }

      const token = jwt.sign(
        {
          id: req.user.id,
          email: req.user.email,
          is_admin: req.user.is_admin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      console.log("Generated token for user:", req.user.email);

      // Redirect to frontend with token
      res.redirect(`${process.env.CORS_ORIGIN}/auth/callback?token=${token}`);
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect(
        `${process.env.CORS_ORIGIN}/login?error=token_generation_failed`
      );
    }
  }
);

// OAuth error handling
router.get("/google/error", (req, res) => {
  console.error("Google OAuth error:", req.query.error);
  res.redirect(
    `${process.env.CORS_ORIGIN}/login?error=oauth_failed&message=${req.query.error}`
  );
});

// Dashboard route
router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with all related data
    const { Item, Swap } = require("../models");

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Item,
          as: "items",
          include: [
            { model: require("../models").Category, as: "category" },
            { model: require("../models").Size, as: "size" },
            { model: require("../models").Condition, as: "condition" },
            { model: require("../models").ItemImage, as: "images" },
            { model: require("../models").Tag, as: "tags" },
          ],
        },
        {
          model: Swap,
          as: "sentSwaps",
          include: [
            {
              model: Item,
              as: "item",
              include: [
                { model: User, as: "owner", attributes: ["id", "name"] },
                { model: require("../models").ItemImage, as: "images" },
              ],
            },
            {
              model: User,
              as: "toUser",
            },
          ],
        },
        {
          model: Swap,
          as: "receivedSwaps",
          include: [
            {
              model: Item,
              as: "item",
              include: [
                { model: User, as: "owner", attributes: ["id", "name"] },
                { model: require("../models").ItemImage, as: "images" },
              ],
            },
            {
              model: User,
              as: "fromUser",
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        is_admin: user.is_admin,
        points_balance: user.points_balance,
        profile_image_url: user.profile_image_url,
        latitude: user.latitude,
        longitude: user.longitude,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        postal_code: user.postal_code,
      },
      items: user.items || [],
      sentSwaps: user.sentSwaps || [],
      receivedSwaps: user.receivedSwaps || [],
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Regular registration
router.post(
  "/register",
  [
    body("name")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password_hash")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("bio")
      .isLength({ min: 2, max: 100 })
      .withMessage("Bio must be between 2 and 100 characters"),
    body("latitude")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Valid latitude is required"),
    body("longitude")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Valid longitude is required"),
    body("address")
      .isLength({ min: 5, max: 200 })
      .withMessage("Address must be between 5 and 200 characters"),
    body("city")
      .isLength({ min: 2, max: 50 })
      .withMessage("City must be between 2 and 50 characters"),
    body("state")
      .isLength({ min: 2, max: 50 })
      .withMessage("State must be between 2 and 50 characters"),
    body("country")
      .isLength({ min: 2, max: 50 })
      .withMessage("Country must be between 2 and 50 characters"),
    body("postal_code")
      .isLength({ min: 3, max: 10 })
      .withMessage("Postal code must be between 3 and 10 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        email,
        password_hash,
        bio,
        latitude,
        longitude,
        address,
        city,
        state,
        country,
        postal_code,
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password_hash, 10);

      // Create user
      const adminEmails = [
        "fighterkeshav8@gmail.com",
        "dannyholmes943@gmail.com",
      ];
      const user = await User.create({
        name,
        email,
        password_hash: hashedPassword,
        bio,
        latitude,
        longitude,
        address,
        city,
        state,
        country,
        postal_code,
        is_admin: adminEmails.includes(email),
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, is_admin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          is_admin: user.is_admin,
          points_balance: user.points_balance,
          latitude: user.latitude,
          longitude: user.longitude,
          address: user.address,
          city: user.city,
          state: user.state,
          country: user.country,
          postal_code: user.postal_code,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Regular login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password_hash").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password_hash } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(
        password_hash,
        user.password_hash
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, is_admin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          is_admin: user.is_admin,
          points_balance: user.points_balance,
          profile_image_url: user.profile_image_url,
          latitude: user.latitude,
          longitude: user.longitude,
          address: user.address,
          city: user.city,
          state: user.state,
          country: user.country,
          postal_code: user.postal_code,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
