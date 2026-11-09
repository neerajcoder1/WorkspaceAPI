const {
  createProject,
  getWorkspaceProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../services/projectService");

// Handle project creation
async function create(req, res, next) {
  try {
    const { name, description, status, start_date, due_date } = req.body;

    const project = await createProject({
      workspaceId: req.params.workspaceId,
      name,
      description,
      status,
      start_date,
      due_date,
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
}

// Handle project listing
async function list(req, res, next) {
  try {
    const projects = await getWorkspaceProjects(
      req.params.workspaceId,
      req.query,
    );

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: {
        count: projects.length,
        projects,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Handle project details
async function getDetails(req, res, next) {
  try {
    const project = await getProjectById(
      req.params.workspaceId,
      req.params.projectId,
    );

    return res.status(200).json({
      success: true,
      message: "Project details fetched successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
}

// Handle project update
async function update(req, res, next) {
  try {
    const { name, description, status, start_date, due_date } = req.body;

    const project = await updateProject({
      workspaceId: req.params.workspaceId,
      projectId: req.params.projectId,
      name,
      description,
      status,
      start_date,
      due_date,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
}

// Handle project deletion
async function remove(req, res, next) {
  try {
    const project = await deleteProject(
      req.params.workspaceId,
      req.params.projectId,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: { project },
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
};
