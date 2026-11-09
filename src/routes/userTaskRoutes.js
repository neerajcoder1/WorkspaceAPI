const express = require("express");

const router = express.Router();

const {
  getMyAssignedTasks,
  getDetails,
  update,
  updateStatus,
  remove,
} = require("../controllers/taskController");

const {
  getTaskById,
  verifyWorkspaceMember,
} = require("../services/taskService");
const {
  getTaskComments,
  addTaskComment,
} = require("../services/activityService");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  validateUpdateTask,
  validateUpdateTaskStatus,
} = require("../validators/taskValidator");
const { validateComment } = require("../validators/commentValidator");

router.use(authenticateToken);

// GET /api/tasks/my (Dashboard "My assigned tasks")
router.get("/my", getMyAssignedTasks);

// GET /api/tasks/:taskId
router.get("/:taskId", getDetails);

// PUT /api/tasks/:taskId
router.put("/:taskId", validateUpdateTask, update);

// PATCH /api/tasks/:taskId/status
router.patch("/:taskId/status", validateUpdateTaskStatus, updateStatus);

// DELETE /api/tasks/:taskId
router.delete("/:taskId", remove);

// Comments endpoints:
// GET /api/tasks/:taskId/comments
router.get("/:taskId/comments", async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.taskId);
    const member = await verifyWorkspaceMember(task.workspace_id, req.user.id);

    if (!member) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this task",
      });
    }

    const comments = await getTaskComments(task.workspace_id, req.params.taskId);

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: {
        count: comments.length,
        comments,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks/:taskId/comments
router.post("/:taskId/comments", validateComment, async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.taskId);
    const member = await verifyWorkspaceMember(task.workspace_id, req.user.id);

    if (!member) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this task",
      });
    }

    const comment = await addTaskComment({
      workspaceId: task.workspace_id,
      taskId: req.params.taskId,
      userId: req.user.id,
      comment: req.body.comment,
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
