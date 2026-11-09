const { pool } = require("../config/db");
const { logActivity } = require("./activityService");

// Create a new project inside a workspace
async function createProject({
  workspaceId,
  name,
  description,
  status = "planning",
  start_date = null,
  due_date = null,
  userId,
}) {
  const [result] = await pool.execute(
    `INSERT INTO projects (workspace_id, name, description, status, start_date, due_date, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      workspaceId,
      name,
      description || null,
      status,
      start_date || null,
      due_date || null,
      userId,
    ],
  );

  const projectId = result.insertId;

  // Log activity
  await logActivity({
    workspaceId,
    userId,
    action: "project_created",
    entityType: "project",
    entityId: projectId,
    details: { name, status },
  });

  return getProjectById(workspaceId, projectId);
}

// Get all projects in a workspace with task statistics
async function getWorkspaceProjects(workspaceId, filters = {}) {
  let query = `
    SELECT
      p.id,
      p.workspace_id,
      p.name,
      p.description,
      p.status,
      p.start_date,
      p.due_date,
      p.created_by,
      u.name AS creator_name,
      u.email AS creator_email,
      p.created_at,
      p.updated_at,
      COUNT(t.id) AS total_tasks,
      COALESCE(SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END), 0) AS completed_tasks
    FROM projects p
    LEFT JOIN users u ON p.created_by = u.id
    LEFT JOIN tasks t ON p.id = t.project_id
    WHERE p.workspace_id = ?
  `;

  const queryParams = [workspaceId];

  if (filters.status) {
    query += " AND p.status = ?";
    queryParams.push(filters.status);
  }

  query += `
    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC
  `;

  const [projects] = await pool.execute(query, queryParams);

  return projects.map((p) => {
    const total = Number(p.total_tasks) || 0;
    const completed = Number(p.completed_tasks) || 0;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      ...p,
      total_tasks: total,
      completed_tasks: completed,
      progress_percentage: progress,
    };
  });
}

// Get project details by ID within a workspace
async function getProjectById(workspaceId, projectId) {
  const [projects] = await pool.execute(
    `SELECT
       p.id,
       p.workspace_id,
       p.name,
       p.description,
       p.status,
       p.start_date,
       p.due_date,
       p.created_by,
       u.name AS creator_name,
       u.email AS creator_email,
       p.created_at,
       p.updated_at,
       COUNT(t.id) AS total_tasks,
       COALESCE(SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END), 0) AS completed_tasks
     FROM projects p
     LEFT JOIN users u ON p.created_by = u.id
     LEFT JOIN tasks t ON p.id = t.project_id
     WHERE p.id = ? AND p.workspace_id = ?
     GROUP BY p.id, u.id`,
    [projectId, workspaceId],
  );

  if (projects.length === 0) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  const p = projects[0];
  const total = Number(p.total_tasks) || 0;
  const completed = Number(p.completed_tasks) || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    ...p,
    total_tasks: total,
    completed_tasks: completed,
    progress_percentage: progress,
  };
}

// Update an existing project
async function updateProject({
  workspaceId,
  projectId,
  name,
  description,
  status,
  start_date,
  due_date,
  userId = null,
}) {
  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push("name = ?");
    values.push(name);
  }

  if (description !== undefined) {
    updates.push("description = ?");
    values.push(description);
  }

  if (status !== undefined) {
    updates.push("status = ?");
    values.push(status);
  }

  if (start_date !== undefined) {
    updates.push("start_date = ?");
    values.push(start_date || null);
  }

  if (due_date !== undefined) {
    updates.push("due_date = ?");
    values.push(due_date || null);
  }

  if (updates.length === 0) {
    return getProjectById(workspaceId, projectId);
  }

  values.push(projectId, workspaceId);

  const [result] = await pool.execute(
    `UPDATE projects
     SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND workspace_id = ?`,
    values,
  );

  if (result.affectedRows === 0) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  const updatedProject = await getProjectById(workspaceId, projectId);

  await logActivity({
    workspaceId,
    userId,
    action: "project_updated",
    entityType: "project",
    entityId: projectId,
    details: { name: updatedProject.name, status: updatedProject.status },
  });

  return updatedProject;
}

// Delete a project
async function deleteProject(workspaceId, projectId, userId = null) {
  const existing = await getProjectById(workspaceId, projectId);

  const [result] = await pool.execute(
    `DELETE FROM projects
     WHERE id = ? AND workspace_id = ?`,
    [projectId, workspaceId],
  );

  if (result.affectedRows === 0) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  await logActivity({
    workspaceId,
    userId,
    action: "project_deleted",
    entityType: "project",
    entityId: projectId,
    details: { name: existing.name },
  });

  return {
    id: Number(projectId),
    workspace_id: Number(workspaceId),
  };
}

module.exports = {
  createProject,
  getWorkspaceProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
