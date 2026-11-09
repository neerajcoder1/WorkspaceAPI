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

const createProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Project name must contain at least 2 characters")
      .max(150, "Project name cannot exceed 150 characters"),

    description: z
      .string()
      .trim()
      .max(2000, "Description cannot exceed 2000 characters")
      .nullable()
      .optional()
      .or(z.literal("")),

    status: z
      .enum(["planning", "active", "completed", "archived"], {
        errorMap: () => ({
          message: "Status must be planning, active, completed, or archived",
        }),
      })
      .default("planning"),

    start_date: dateSchema,
    due_date: dateSchema,
  })
  .refine(
    (data) => {
      if (data.start_date && data.due_date) {
        return new Date(data.due_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "Due date must be on or after start date",
      path: ["due_date"],
    },
  );

const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Project name must contain at least 2 characters")
      .max(150, "Project name cannot exceed 150 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(2000, "Description cannot exceed 2000 characters")
      .nullable()
      .optional(),

    status: z
      .enum(["planning", "active", "completed", "archived"], {
        errorMap: () => ({
          message: "Status must be planning, active, completed, or archived",
        }),
      })
      .optional(),

    start_date: dateSchema,
    due_date: dateSchema,
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.description !== undefined ||
      data.status !== undefined ||
      data.start_date !== undefined ||
      data.due_date !== undefined,
    {
      message: "At least one field must be provided for update",
    },
  )
  .refine(
    (data) => {
      if (data.start_date && data.due_date) {
        return new Date(data.due_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "Due date must be on or after start date",
      path: ["due_date"],
    },
  );

function validateCreateProject(req, res, next) {
  const result = createProjectSchema.safeParse(req.body);

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

function validateUpdateProject(req, res, next) {
  const result = updateProjectSchema.safeParse(req.body);

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
  validateCreateProject,
  validateUpdateProject,
};
