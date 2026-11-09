const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../services/authService");

const { generateAccessToken } = require("../utils/token");

// Handle user registration
async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

// Handle user login
async function login(req, res, next) {
  try {
    const user = await loginUser(req.body);
    const token = generateAccessToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Handle authenticated user's profile
async function getProfile(req, res, next) {
  try {
    const user = await getUserProfile(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
};
