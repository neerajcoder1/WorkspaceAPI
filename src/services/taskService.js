const { pool } = require("../config/db");
const { logActivity } = require("./activityService");

// Verify that a user is an active member of a workspace
async function verifyWorkspaceMember(workspaceId, userId) {
  const [members] = await pool.execute(
    `SELECT id, role
     FROM workspace_members
     WHERE workspace_id = ? AND user_id = ?`,
    [workspaceId, userId],
  );

  return members.length > 0 ? members[0] : null;
}

// Get task details with assignee, creator, and project information
async function getTaskById(taskId, workspaceId = null) {
  let query = `
    SELECT
      t.id,
      t.project_id,
      p.workspace_id,
      p.name AS project_name,
      t.title,
      t.description,
      t.status,
      t.priority,
      t.due_date,
      t.assigned_to,
      assignee.name AS assignee_name,
      assignee.email AS assignee_email,
      t.created_by,
      creator.name AS creator_name,
      creator.email AS creator_email,
      t.created_at,
      t.updated_at
    FROM tasks t
    INNER JOIN projects p ON t.project_id = p.id
    LEFT JOIN users assignee ON t.assigned_to = assignee.id
    LEFT JOIN users creator ON t.created_by = creator.id
    WHERE t.id = ?
  `;

  const params = [taskId];

  if (workspaceId) {
    query += " AND p.workspace_id = ?";
    params.push(workspaceId);
  }

  const [tasks] = await pool.execute(query, params);

  if (tasks.length === 0) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  return tasks[0];
}

// Create a new task inside a project
async function createTask({
  workspaceId,
  projectId,
  title,
  description = null,
  status = "todo",
  priority = "medium",
  due_date = null,
  assigned_to = null,
  userId,
}) {
  // 1. Verify project exists within the workspace
  const [projects] = await pool.execute(
    `SELECT id FROM projects WHERE id = ? AND workspace_id = ?`,
    [projectId, workspaceId],
  );

  if (projects.length === 0) {
    const error = new Error("Project not found in this workspace");
    error.status = 404;
    throw error;
  }

  // 2. If assigned_to is specified, verify that assignee belongs to the workspace
  if (assigned_to) {
    const isMember = await verifyWorkspaceMember(workspaceId, assigned_to);
    if (!isMember) {
      const error = new Error(
        "Assigned user is not a member of this workspace",
      );
      error.status = 400;
      throw error;
    }
  }

  // 3. Insert task
  const [result] = await pool.execute(
    `INSERT INTO tasks (project_id, assigned_to, title, description, status, priority, due_date, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      projectId,
      assigned_to || null,
      title,
      description || null,
      status,
      priority,
      due_date || null,
      userId,
    ],
  );

  const taskId = result.insertId;

  // Log activity
  await logActivity({
    workspaceId,
    userId,
    action: "task_created",
    entityType: "task",
    entityId: taskId,
    details: {
      title,
      status,
      priority,
      project_id: projectId,
    },
  });

  return getTaskById(taskId, workspaceId);
}

// Get all tasks for a project with optional filters
async function getProjectTasks(workspaceId, projectId, filters = {}) {
  // Verify project exists in workspace
  const [projects] = await pool.execute(
    `SELECT id FROM projects WHERE id = ? AND workspace_id = ?`,
    [projectId, workspaceId],
  );

  if (projects.length === 0) {
    const error = new Error("Project not found in this workspace");
    error.status = 404;
    throw error;
  }

  let query = `
    SELECT
      t.id,
      t.project_id,
      p.name AS project_name,
      t.title,
      t.description,
      t.status,
      t.priority,
      t.due_date,
      t.assigned_to,
      assignee.name AS assignee_name,
      assignee.email AS assignee_email,
      t.created_by,
      creator.name AS creator_name,
      creator.email AS creator_email,
      t.created_at,
      t.updated_at
    FROM tasks t
    INNER JOIN projects p ON t.project_id = p.id
    LEFT JOIN users assignee ON t.assigned_to = assignee.id
    LEFT JOIN users creator ON t.created_by = creator.id
    WHERE t.project_id = ? AND p.workspace_id = ?
  `;

  const queryParams = [projectId, workspaceId];

  if (filters.status) {
    query += " AND t.status = ?";
    queryParams.push(filters.status);
  }

  if (filters.priority) {
    query += " AND t.priority = ?";
    queryParams.push(filters.priority);
  }

  if (filters.assigned_to) {
    query += " AND t.assigned_to = ?";
    queryParams.push(filters.assigned_to);
  }

  query += `
    ORDER BY
      CASE t.priority
        WHEN 'urgent' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
      END,
      t.created_at DESC
  `;

  const [tasks] = await pool.execute(query, queryParams);
  return tasks;
}

// Update task details
async function updateTask({
  taskId,
  workspaceId,
  title,
  description,
  status,
  priority,
  due_date,
  assigned_to,
  userId = null,
}) {
  // Retrieve existing task and check workspace boundary
  const existing = await getTaskById(taskId, workspaceId);

  // If assigning to a user, verify membership
  if (assigned_to !== undefined && assigned_to !== null) {
    const isMember = await verifyWorkspaceMember(
      existing.workspace_id,
      assigned_to,
    );
    if (!isMember) {
      const error = new Error(
        "Assigned user is not a member of this workspace",
      );
      error.status = 400;
      throw error;
    }
  }

  const updates = [];
  const values = [];

  if (title !== undefined) {
    updates.push("title = ?");
    values.push(title);
  }

  if (description !== undefined) {
    updates.push("description = ?");
    values.push(description);
  }

  if (status !== undefined) {
    updates.push("status = ?");
    values.push(status);
  }

  if (priority !== undefined) {
    updates.push("priority = ?");
    values.push(priority);
  }

  if (due_date !== undefined) {
    updates.push("due_date = ?");
    values.push(due_date || null);
  }

  if (assigned_to !== undefined) {
    updates.push("assigned_to = ?");
    values.push(assigned_to || null);
  }

  if (updates.length === 0) {
    return existing;
  }

  values.push(taskId);

  await pool.execute(
    `UPDATE tasks
     SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    values,
  );

  const updatedTask = await getTaskById(taskId, workspaceId);

  await logActivity({
    workspaceId: updatedTask.workspace_id,
    userId,
    action: "task_updated",
    entityType: "task",
    entityId: taskId,
    details: {
      title: updatedTask.title,
      status: updatedTask.status,
      priority: updatedTask.priority,
    },
  });

  return updatedTask;
}

// Fast update of task status (e.g. Kanban drag and drop)
async function updateTaskStatus({ taskId, workspaceId, status, userId = null }) {
  const existing = await getTaskById(taskId, workspaceId);

  await pool.execute(
    `UPDATE tasks
     SET status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [status, taskId],
  );

  const updatedTask = await getTaskById(taskId, workspaceId);

  await logActivity({
    workspaceId: updatedTask.workspace_id,
    userId,
    action: "task_status_changed",
    entityType: "task",
    entityId: taskId,
    details: {
      title: updatedTask.title,
      old_status: existing.status,
      new_status: status,
    },
  });

  return updatedTask;
}

// Delete a task
async function deleteTask(taskId, workspaceId, userId = null) {
  const existing = await getTaskById(taskId, workspaceId);

  await pool.execute(`DELETE FROM tasks WHERE id = ?`, [taskId]);

  await logActivity({
    workspaceId: existing.workspace_id,
    userId,
    action: "task_deleted",
    entityType: "task",
    entityId: taskId,
    details: {
      title: existing.title,
      project_id: existing.project_id,
    },
  });

  return {
    id: Number(taskId),
    project_id: existing.project_id,
    workspace_id: existing.workspace_id,
  };
}

// Get tasks assigned to a specific user across workspaces
async function getUserAssignedTasks(userId) {
  const [tasks] = await pool.execute(
    `SELECT
       t.id,
       t.title,
       t.status,
       t.priority,
       t.due_date,
       p.id AS project_id,
       p.name AS project_name,
       w.id AS workspace_id,
       w.name AS workspace_name
     FROM tasks t
     INNER JOIN projects p ON t.project_id = p.id
     INNER JOIN workspaces w ON p.workspace_id = w.id
     INNER JOIN workspace_members wm ON w.id = wm.workspace_id AND wm.user_id = ?
     WHERE t.assigned_to = ?
     ORDER BY
       CASE t.status
         WHEN 'todo' THEN 1
         WHEN 'in_progress' THEN 2
         WHEN 'review' THEN 3
         WHEN 'done' THEN 4
       END,
       t.due_date ASC`,
    [userId, userId],
  );

  return tasks;
}

module.exports = {
  verifyWorkspaceMember,
  getTaskById,
  createTask,
  getProjectTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getUserAssignedTasks,
};
