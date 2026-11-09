const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  create,
  listByProject,
  getDetails,
  update,
  updateStatus,
  remove,
} = require("../controllers/taskController");

const { authenticateToken } = require("../middleware/authMiddleware");
const {
  requireWorkspaceRole,
} = require("../middleware/workspaceRoleMiddleware");
const {
  validateCreateTask,
  validateUpdateTask,
  validateUpdateTaskStatus,
} = require("../validators/taskValidator");

router.use(authenticateToken);

// Project-level task endpoints (/api/workspaces/:workspaceId/projects/:projectId/tasks)
router.post(
  "/",
  requireWorkspaceRole("owner", "admin", "member"),
  validateCreateTask,
  create,
);

router.get(
  "/",
  requireWorkspaceRole("owner", "admin", "member"),
  listByProject,
);

// Individual task endpoints (when mounted with :taskId)
router.get(
  "/:taskId",
  requireWorkspaceRole("owner", "admin", "member"),
  getDetails,
);

router.put(
  "/:taskId",
  requireWorkspaceRole("owner", "admin", "member"),
  validateUpdateTask,
  update,
);

router.patch(
  "/:taskId/status",
  requireWorkspaceRole("owner", "admin", "member"),
  validateUpdateTaskStatus,
  updateStatus,
);

router.delete(
  "/:taskId",
  requireWorkspaceRole("owner", "admin"),
  remove,
);

module.exports = router;
