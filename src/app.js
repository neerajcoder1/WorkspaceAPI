const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const userTaskRoutes = require("./routes/userTaskRoutes");
const { setupSwagger } = require("./config/swagger");

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration supporting Vite dev and preview servers
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// General API Rate Limiting (1000 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
  },
});
app.use("/api", apiLimiter);

// Specific Auth Rate Limiting (50 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again after 15 minutes",
  },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Request parsing
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

// Swagger / OpenAPI documentation
setupSwagger(app);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "WorkSphere API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/tasks", userTaskRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status =
    Number.isInteger(err.status) && err.status >= 400 && err.status <= 599
      ? err.status
      : 500;

  if (status >= 500) {
    console.error("Internal server error:", err);
  }

  let message = "Internal server error";

  if (err.message && status < 500) {
    message = err.message;
  } else if (status === 400) {
    message = "Bad request";
  } else if (status === 401) {
    message = "Authentication required";
  } else if (status === 403) {
    message = "Forbidden";
  } else if (status === 404) {
    message = "Not found";
  } else if (status === 409) {
    message = "Conflict";
  }

  return res.status(status).json({
    success: false,
    message,
  });
});

module.exports = app;
