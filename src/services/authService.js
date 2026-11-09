const bcrypt = require("bcrypt");
const { pool } = require("../config/db");

// Register a new user
async function registerUser({ name, email, password }) {
  const normalizedEmail = email.toLowerCase();

  const [existingUsers] = await pool.execute(
    "SELECT id FROM users WHERE email = ?",
    [normalizedEmail],
  );

  if (existingUsers.length > 0) {
    const error = new Error("Email is already registered");
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password_hash)
       VALUES (?, ?, ?)`,
      [name, normalizedEmail, passwordHash],
    );

    return {
      id: result.insertId,
      name,
      email: normalizedEmail,
    };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const duplicateError = new Error("Email is already registered");
      duplicateError.status = 409;
      throw duplicateError;
    }

    throw error;
  }
}

// Login user
async function loginUser({ email, password }) {
  const normalizedEmail = email.toLowerCase();

  const [users] = await pool.execute(
    `SELECT id, name, email, password_hash
     FROM users
     WHERE email = ?`,
    [normalizedEmail],
  );

  if (users.length === 0) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const user = users[0];

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

// Get authenticated user's profile
async function getUserProfile(userId) {
  const [users] = await pool.execute(
    `SELECT id, name, email, created_at
     FROM users
     WHERE id = ?`,
    [userId],
  );

  if (users.length === 0) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return users[0];
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
