const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "worksphere-jwt-secret-key-production-fallback-2026";

function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
    },
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      algorithm: "HS256",
    },
  );
}

module.exports = { generateAccessToken, JWT_SECRET };
