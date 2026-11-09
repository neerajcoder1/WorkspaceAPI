const { pool } = require("../config/db");

function requireWorkspaceRole(...allowedRoles) {
  return async function (req, res, next) {
    try {
      const workspaceId = req.params.workspaceId;
      const userId = req.user.id;

      const [members] = await pool.execute(
        `SELECT role
         FROM workspace_members
         WHERE workspace_id = ? AND user_id = ?`,
        [workspaceId, userId],
      );

      if (members.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
        });
      }

      const userRole = members[0].role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action",
        });
      }

      req.workspace = {
        id: Number(workspaceId),
        role: userRole,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { requireWorkspaceRole };
