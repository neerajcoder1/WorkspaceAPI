const { z } = require("zod");

const deleteWorkspaceSchema = z.object({
  confirmation: z.literal("DELETE", {
    errorMap: () => ({
      message: "Confirmation must be DELETE",
    }),
  }),
});

function validateDeleteWorkspace(req, res, next) {
  const result = deleteWorkspaceSchema.safeParse(req.body);

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

  next();
}

module.exports = { validateDeleteWorkspace };
