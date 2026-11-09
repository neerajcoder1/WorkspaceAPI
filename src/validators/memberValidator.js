const { z } = require("zod");

const addMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(150, "Email cannot exceed 150 characters"),

  role: z
    .enum(["admin", "member"], {
      errorMap: () => ({
        message: "Role must be either admin or member",
      }),
    })
    .default("member"),
});

function validateAddMember(req, res, next) {
  const result = addMemberSchema.safeParse(req.body);

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

module.exports = { validateAddMember };
