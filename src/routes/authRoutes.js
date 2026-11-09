const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");

const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidator");

const { authenticateToken } = require("../middleware/authMiddleware");

// Registration
router.post("/register", validateRegister, register);

// Login
router.post("/login", validateLogin, login);

// Protected profile
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
