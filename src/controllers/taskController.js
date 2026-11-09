const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getUserAssignedTasks,
} = require("../services/taskService");

// Handle task creation
async function create(req, res, next) {
  try {
    const { title, description, status, priority, due_date, assigned_to } =
      req.body;

    const task = await createTask({
      workspaceId: req.params.workspaceId,
      projectId: req.params.projectId,
      title,
      description,
      status,
      priority,
      due_date,
      assigned_to,
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

// Handle task listing for a project
async function listByProject(req, res, next) {
  try {
    const tasks = await getProjectTasks(
      req.params.workspaceId,
      req.params.projectId,
      req.query,
    );

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: {
        count: tasks.length,
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Handle task details
async function getDetails(req, res, next) {
  try {
    const task = await getTaskById(
      req.params.taskId,
      req.params.workspaceId || null,
    );

    return res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

// Handle task update
async function update(req, res, next) {
  try {
    const { title, description, status, priority, due_date, assigned_to } =
      req.body;

    const task = await updateTask({
      taskId: req.params.taskId,
      workspaceId: req.params.workspaceId || null,
      title,
      description,
      status,
      priority,
      due_date,
      assigned_to,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

// Handle status change
async function updateStatus(req, res, next) {
  try {
    const task = await updateTaskStatus({
      taskId: req.params.taskId,
      workspaceId: req.params.workspaceId || null,
      status: req.body.status,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

// Handle task deletion
async function remove(req, res, next) {
  try {
    const task = await deleteTask(
      req.params.taskId,
      req.params.workspaceId || null,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

// Handle assigned tasks for current user
async function getMyAssignedTasks(req, res, next) {
  try {
    const tasks = await getUserAssignedTasks(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Assigned tasks fetched successfully",
      data: {
        count: tasks.length,
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  listByProject,
  getDetails,
  update,
  updateStatus,
  remove,
  getMyAssignedTasks,
};
