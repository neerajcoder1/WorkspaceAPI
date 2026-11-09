const {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addWorkspaceMember,
  getWorkspaceMembers,
} = require("../services/workspaceService");

// Handle workspace creation
async function create(req, res, next) {
  try {
    const { name, description } = req.body;

    const workspace = await createWorkspace({
      name,
      description,
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: { workspace },
    });
  } catch (error) {
    next(error);
  }
}

// Handle workspace listing
async function list(req, res, next) {
  try {
    const workspaces = await getUserWorkspaces(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Workspaces fetched successfully",
      data: {
        count: workspaces.length,
        workspaces,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Handle workspace details
async function getDetails(req, res, next) {
  try {
    const workspace = await getWorkspaceById(
      req.params.workspaceId,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Workspace details fetched successfully",
      data: { workspace },
    });
  } catch (error) {
    next(error);
  }
}

// Handle workspace update
async function update(req, res, next) {
  try {
    const workspace = await updateWorkspace({
      workspaceId: req.params.workspaceId,
      name: req.body.name,
      description: req.body.description,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      data: { workspace },
    });
  } catch (error) {
    next(error);
  }
}

// Handle workspace deletion
async function remove(req, res, next) {
  try {
    const workspace = await deleteWorkspace(req.params.workspaceId);

    return res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
      data: { workspace },
    });
  } catch (error) {
    next(error);
  }
}

// Handle adding a workspace member
async function addMember(req, res, next) {
  try {
    const member = await addWorkspaceMember({
      workspaceId: req.params.workspaceId,
      email: req.body.email,
      role: req.body.role,
      actorUserId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Workspace member added successfully",
      data: { member },
    });
  } catch (error) {
    next(error);
  }
}

// Handle listing workspace members
async function getMembers(req, res, next) {
  try {
    const members = await getWorkspaceMembers(req.params.workspaceId);

    return res.status(200).json({
      success: true,
      message: "Workspace members fetched successfully",
      data: {
        count: members.length,
        members,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  list,
  getDetails,
  update,
  remove,
  addMember,
  getMembers,
};
