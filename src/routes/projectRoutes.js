const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  create,
  list,
  getDetails,
  update,
  remove,
} = require("../controllers/projectController");

const { authenticateToken } = require("../middleware/authMiddleware");
const {
  requireWorkspaceRole,
} = require("../middleware/workspaceRoleMiddleware");
const {
  validateCreateProject,
  validateUpdateProject,
} = require("../validators/projectValidator");

const taskRoutes = require("./taskRoutes");

// All project routes require authentication
router.use(authenticateToken);

// Nested task routes for project (/api/workspaces/:workspaceId/projects/:projectId/tasks)
router.use("/:projectId/tasks", taskRoutes);

// POST /api/workspaces/:workspaceId/projects (Owner/Admin)
router.post(
  "/",
  requireWorkspaceRole("owner", "admin"),
  validateCreateProject,
  create,
);

// GET /api/workspaces/:workspaceId/projects (All workspace members)
router.get(
  "/",
  requireWorkspaceRole("owner", "admin", "member"),
  list,
);

// GET /api/workspaces/:workspaceId/projects/:projectId (All workspace members)
router.get(
  "/:projectId",
  requireWorkspaceRole("owner", "admin", "member"),
  getDetails,
);

// PUT /api/workspaces/:workspaceId/projects/:projectId (Owner/Admin)
router.put(
  "/:projectId",
  requireWorkspaceRole("owner", "admin"),
  validateUpdateProject,
  update,
);

// DELETE /api/workspaces/:workspaceId/projects/:projectId (Owner/Admin)
router.delete(
  "/:projectId",
  requireWorkspaceRole("owner", "admin"),
  remove,
);

module.exports = router;
