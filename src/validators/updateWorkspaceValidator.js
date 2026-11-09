const { z } = require("zod");

const updateWorkspaceSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Workspace name must be at least 3 characters")
      .max(150, "Workspace name cannot exceed 150 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters")
      .nullable()
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "At least one field must be provided for update",
  });

function validateUpdateWorkspace(req, res, next) {
  const result = updateWorkspaceSchema.safeParse(req.body);

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

module.exports = { validateUpdateWorkspace };
