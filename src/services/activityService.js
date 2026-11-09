const { pool } = require("../config/db");

// Log an activity event to activity_logs table
async function logActivity({
  workspaceId,
  userId,
  action,
  entityType,
  entityId = null,
  details = null,
}) {
  try {
    const detailsJson = details ? JSON.stringify(details) : null;

    const [result] = await pool.execute(
      `INSERT INTO activity_logs (workspace_id, user_id, action, entity_type, entity_id, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        workspaceId,
        userId || null,
        action,
        entityType,
        entityId || null,
        detailsJson,
      ],
    );

    return result.insertId;
  } catch (error) {
    // Non-blocking: log error to console so primary operation does not fail
    console.error("Failed to log activity:", error.message);
    return null;
  }
}

// Get activity feed for a workspace
async function getWorkspaceActivities(workspaceId, { limit = 30, offset = 0, entityType } = {}) {
  let query = `
    SELECT
      a.id,
      a.workspace_id,
      a.user_id,
      u.name AS user_name,
      u.email AS user_email,
      a.action,
      a.entity_type,
      a.entity_id,
      a.details,
      a.created_at
    FROM activity_logs a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.workspace_id = ?
  `;

  const params = [workspaceId];

  if (entityType) {
    query += " AND a.entity_type = ?";
    params.push(entityType);
  }

  // Safe parsing of limit/offset as positive integers
  const safeLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 30));
  const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

  query += ` ORDER BY a.created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

  const [rows] = await pool.execute(query, params);

  return rows.map((row) => ({
    ...row,
    details: typeof row.details === "string" ? JSON.parse(row.details) : row.details,
  }));
}

// Get comments for a specific task
async function getTaskComments(workspaceId, taskId) {
  // Query comments for this task
  const [rows] = await pool.execute(
    `SELECT
       a.id,
       a.workspace_id,
       a.user_id,
       u.name AS user_name,
       u.email AS user_email,
       a.action,
       a.entity_type,
       a.entity_id AS task_id,
       a.details,
       a.created_at
     FROM activity_logs a
     INNER JOIN users u ON a.user_id = u.id
     WHERE a.workspace_id = ? AND a.entity_type = 'task' AND a.entity_id = ? AND a.action = 'comment_added'
     ORDER BY a.created_at ASC`,
    [workspaceId, taskId],
  );

  return rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    user_name: row.user_name,
    user_email: row.user_email,
    comment: (typeof row.details === "string" ? JSON.parse(row.details) : row.details)?.comment || "",
    created_at: row.created_at,
  }));
}

// Add a comment to a task
async function addTaskComment({ workspaceId, taskId, userId, comment }) {
  // Verify task exists and belongs to workspace
  const [tasks] = await pool.execute(
    `SELECT t.id, t.title, p.workspace_id
     FROM tasks t
     INNER JOIN projects p ON t.project_id = p.id
     WHERE t.id = ? AND p.workspace_id = ?`,
    [taskId, workspaceId],
  );

  if (tasks.length === 0) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  const task = tasks[0];

  const logId = await logActivity({
    workspaceId,
    userId,
    action: "comment_added",
    entityType: "task",
    entityId: taskId,
    details: {
      comment,
      task_title: task.title,
    },
  });

  // Fetch author details
  const [users] = await pool.execute(
    `SELECT name, email FROM users WHERE id = ?`,
    [userId],
  );

  const author = users[0] || {};

  return {
    id: logId,
    task_id: Number(taskId),
    user_id: Number(userId),
    user_name: author.name,
    user_email: author.email,
    comment,
    created_at: new Date().toISOString(),
  };
}

module.exports = {
  logActivity,
  getWorkspaceActivities,
  getTaskComments,
  addTaskComment,
};
