const express = require("express");

const { register, login, getMe } = require("../controllers/authController.js");

const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// ==================================================
// PUBLIC AUTH ROUTES
// ==================================================

router.post("/register", register);

router.post("/login", login);

// ==================================================
// PROTECTED CURRENT USER ROUTE
// ==================================================

router.get("/me", protect, getMe);

module.exports = router;
