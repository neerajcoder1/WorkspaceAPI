const {
  getWorkspaceActivities,
  getTaskComments,
  addTaskComment,
} = require("../services/activityService");

// Get activity feed for a workspace
async function getWorkspaceActivityFeed(req, res, next) {
  try {
    const activities = await getWorkspaceActivities(
      req.params.workspaceId,
      req.query,
    );

    return res.status(200).json({
      success: true,
      message: "Activities fetched successfully",
      data: {
        count: activities.length,
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Get comments for a task
async function getComments(req, res, next) {
  try {
    const comments = await getTaskComments(
      req.params.workspaceId,
      req.params.taskId,
    );

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
}

// Add a comment to a task
async function addComment(req, res, next) {
  try {
    const comment = await addTaskComment({
      workspaceId: req.params.workspaceId,
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
}

module.exports = {
  getWorkspaceActivityFeed,
  getComments,
  addComment,
};
