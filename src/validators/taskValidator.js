const { z } = require("zod");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const dateSchema = z
  .string()
  .trim()
  .refine(
    (val) => dateRegex.test(val) && !isNaN(Date.parse(val)),
    "Date must be in YYYY-MM-DD format",
  )
  .nullable()
  .optional();

const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Task title must contain at least 2 characters")
    .max(200, "Task title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters")
    .nullable()
    .optional()
    .or(z.literal("")),

  status: z
    .enum(["todo", "in_progress", "review", "done"], {
      errorMap: () => ({
        message: "Status must be todo, in_progress, review, or done",
      }),
    })
    .default("todo"),

  priority: z
    .enum(["low", "medium", "high", "urgent"], {
      errorMap: () => ({
        message: "Priority must be low, medium, high, or urgent",
      }),
    })
    .default("medium"),

  due_date: dateSchema,

  assigned_to: z
    .number()
    .int()
    .positive("Assigned user ID must be a positive integer")
    .nullable()
    .optional(),
});

const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Task title must contain at least 2 characters")
      .max(200, "Task title cannot exceed 200 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(5000, "Description cannot exceed 5000 characters")
      .nullable()
      .optional(),

    status: z
      .enum(["todo", "in_progress", "review", "done"], {
        errorMap: () => ({
          message: "Status must be todo, in_progress, review, or done",
        }),
      })
      .optional(),

    priority: z
      .enum(["low", "medium", "high", "urgent"], {
        errorMap: () => ({
          message: "Priority must be low, medium, high, or urgent",
        }),
      })
      .optional(),

    due_date: dateSchema,

    assigned_to: z
      .number()
      .int()
      .positive("Assigned user ID must be a positive integer")
      .nullable()
      .optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.status !== undefined ||
      data.priority !== undefined ||
      data.due_date !== undefined ||
      data.assigned_to !== undefined,
    {
      message: "At least one field must be provided for update",
    },
  );

const updateStatusSchema = z.object({
  status: z.enum(["todo", "in_progress", "review", "done"], {
    errorMap: () => ({
      message: "Status must be todo, in_progress, review, or done",
    }),
  }),
});

function validateCreateTask(req, res, next) {
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  next();
}

function validateUpdateTask(req, res, next) {
  const result = updateTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  next();
}

function validateUpdateTaskStatus(req, res, next) {
  const result = updateStatusSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  next();
}

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateUpdateTaskStatus,
};
