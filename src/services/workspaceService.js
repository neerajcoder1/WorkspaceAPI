const { pool } = require("../config/db");
const { logActivity } = require("./activityService");

// Create a new workspace
async function createWorkspace({ name, description, userId }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insert workspace
    const [result] = await connection.execute(
      `INSERT INTO workspaces (name, description, created_by)
       VALUES (?, ?, ?)`,
      [name, description || null, userId],
    );

    const workspaceId = result.insertId;

    // Add creator as workspace owner
    await connection.execute(
      `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES (?, ?, ?)`,
      [workspaceId, userId, "owner"],
    );

    await connection.commit();

    // Log activity
    await logActivity({
      workspaceId,
      userId,
      action: "workspace_created",
      entityType: "workspace",
      entityId: workspaceId,
      details: { name },
    });

    return {
      id: workspaceId,
      name,
      description: description || null,
      created_by: userId,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Get all workspaces belonging to a user
async function getUserWorkspaces(userId) {
  const [workspaces] = await pool.execute(
    `SELECT
       w.id,
       w.name,
       w.description,
       w.created_by,
       wm.role,
       wm.joined_at,
       w.created_at,
       w.updated_at
     FROM workspaces w
     INNER JOIN workspace_members wm
       ON w.id = wm.workspace_id
     WHERE wm.user_id = ?
     ORDER BY w.created_at DESC`,
    [userId],
  );

  return workspaces;
}

// Get workspace details for an authenticated member
async function getWorkspaceById(workspaceId, userId) {
  const [workspaces] = await pool.execute(
    `SELECT
       w.id,
       w.name,
       w.description,
       w.created_by,
       wm.role,
       wm.joined_at,
       w.created_at,
       w.updated_at
     FROM workspaces w
     INNER JOIN workspace_members wm
       ON w.id = wm.workspace_id
     WHERE w.id = ? AND wm.user_id = ?`,
    [workspaceId, userId],
  );

  if (workspaces.length === 0) {
    const error = new Error("Workspace not found");
    error.status = 404;
    throw error;
  }

  return workspaces[0];
}

// Update workspace details
async function updateWorkspace({ workspaceId, name, description, userId }) {
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

  values.push(workspaceId);

  await pool.execute(
    `UPDATE workspaces
     SET ${updates.join(", ")}
     WHERE id = ?`,
    values,
  );

  // Check whether the workspace actually exists
  const [workspaces] = await pool.execute(
    `SELECT
       id,
       name,
       description,
       created_by,
       created_at,
       updated_at
     FROM workspaces
     WHERE id = ?`,
    [workspaceId],
  );

  if (workspaces.length === 0) {
    const error = new Error("Workspace not found");
    error.status = 404;
    throw error;
  }

  await logActivity({
    workspaceId,
    userId,
    action: "workspace_updated",
    entityType: "workspace",
    entityId: workspaceId,
    details: { name: workspaces[0].name },
  });

  return workspaces[0];
}

// Delete a workspace
async function deleteWorkspace(workspaceId) {
  const [result] = await pool.execute(
    `DELETE FROM workspaces
     WHERE id = ?`,
    [workspaceId],
  );

  if (result.affectedRows === 0) {
    const error = new Error("Workspace not found");
    error.status = 404;
    throw error;
  }

  return {
    id: Number(workspaceId),
  };
}

// Add a member to a workspace
async function addWorkspaceMember({ workspaceId, email, role, actorUserId = null }) {
  // Find the user by email
  const [users] = await pool.execute(
    `SELECT id, name, email
     FROM users
     WHERE email = ?`,
    [email.toLowerCase()],
  );

  if (users.length === 0) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const user = users[0];

  // Check whether user is already a member
  const [existingMembers] = await pool.execute(
    `SELECT id
     FROM workspace_members
     WHERE workspace_id = ? AND user_id = ?`,
    [workspaceId, user.id],
  );

  if (existingMembers.length > 0) {
    const error = new Error("User is already a workspace member");
    error.status = 409;
    throw error;
  }

  // Add user to workspace
  try {
    await pool.execute(
      `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES (?, ?, ?)`,
      [workspaceId, user.id, role],
    );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const duplicateError = new Error("User is already a workspace member");
      duplicateError.status = 409;
      throw duplicateError;
    }

    throw error;
  }

  // Log activity
  await logActivity({
    workspaceId,
    userId: actorUserId,
    action: "member_added",
    entityType: "member",
    entityId: user.id,
    details: {
      member_name: user.name,
      member_email: user.email,
      role,
    },
  });

  return {
    workspace_id: Number(workspaceId),
    user_id: user.id,
    name: user.name,
    email: user.email,
    role,
  };
}

// Get all members of a workspace
async function getWorkspaceMembers(workspaceId) {
  const [members] = await pool.execute(
    `SELECT
       wm.id,
       wm.workspace_id,
       wm.user_id,
       wm.role,
       wm.joined_at,
       u.name,
       u.email
     FROM workspace_members wm
     INNER JOIN users u
       ON wm.user_id = u.id
     WHERE wm.workspace_id = ?
     ORDER BY
       CASE wm.role
         WHEN 'owner' THEN 1
         WHEN 'admin' THEN 2
         WHEN 'member' THEN 3
         ELSE 4
       END,
       wm.joined_at ASC`,
    [workspaceId],
  );

  return members;
}

module.exports = {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addWorkspaceMember,
  getWorkspaceMembers,
};
