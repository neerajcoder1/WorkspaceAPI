const express = require("express");

const router = express.Router();

const {
  create,
  list,
  getDetails,
  update,
  remove,
  addMember,
  getMembers,
} = require("../controllers/workspaceController");

const {
  getWorkspaceActivityFeed,
  getComments,
  addComment,
} = require("../controllers/activityController");

const { authenticateToken } = require("../middleware/authMiddleware");

const {
  requireWorkspaceRole,
} = require("../middleware/workspaceRoleMiddleware");

const { validateCreateWorkspace } = require("../validators/workspaceValidator");
const { validateAddMember } = require("../validators/memberValidator");
const {
  validateUpdateWorkspace,
} = require("../validators/updateWorkspaceValidator");
const {
  validateDeleteWorkspace,
} = require("../validators/deleteWorkspaceValidator");
const { validateComment } = require("../validators/commentValidator");

const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");

// POST /api/workspaces
router.post("/", authenticateToken, validateCreateWorkspace, create);

// GET /api/workspaces
router.get("/", authenticateToken, list);

// POST /api/workspaces/:workspaceId/members
router.post(
  "/:workspaceId/members",
  authenticateToken,
  requireWorkspaceRole("owner", "admin"),
  validateAddMember,
  addMember,
);

// GET /api/workspaces/:workspaceId/members
router.get(
  "/:workspaceId/members",
  authenticateToken,
  requireWorkspaceRole("owner", "admin", "member"),
  getMembers,
);

// PUT /api/workspaces/:workspaceId
router.put(
  "/:workspaceId",
  authenticateToken,
  requireWorkspaceRole("owner", "admin"),
  validateUpdateWorkspace,
  update,
);

// DELETE /api/workspaces/:workspaceId
router.delete(
  "/:workspaceId",
  authenticateToken,
  requireWorkspaceRole("owner"),
  validateDeleteWorkspace,
  remove,
);

// GET /api/workspaces/:workspaceId/activities (Activity feed)
router.get(
  "/:workspaceId/activities",
  authenticateToken,
  requireWorkspaceRole("owner", "admin", "member"),
  getWorkspaceActivityFeed,
);

// Task comments under workspace:
// GET /api/workspaces/:workspaceId/tasks/:taskId/comments
router.get(
  "/:workspaceId/tasks/:taskId/comments",
  authenticateToken,
  requireWorkspaceRole("owner", "admin", "member"),
  getComments,
);

// POST /api/workspaces/:workspaceId/tasks/:taskId/comments
router.post(
  "/:workspaceId/tasks/:taskId/comments",
  authenticateToken,
  requireWorkspaceRole("owner", "admin", "member"),
  validateComment,
  addComment,
);

// GET /api/workspaces/:workspaceId
router.get("/:workspaceId", authenticateToken, getDetails);

// Nested routes: /api/workspaces/:workspaceId/projects
router.use("/:workspaceId/projects", projectRoutes);

// Nested routes: /api/workspaces/:workspaceId/tasks
router.use("/:workspaceId/tasks", taskRoutes);

module.exports = router;
