const swaggerUi = require("swagger-ui-express");

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "WorkSphere API",
    version: "1.0.0",
    description:
      "Enterprise-grade Workspace, Project, Task Management & Team Collaboration REST API",
    contact: {
      name: "WorkSphere Engineering Team",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token in the format: Bearer <token>",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Neeraj Gahlout" },
          email: { type: "string", example: "neeraj@worksphere.dev" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Workspace: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "VisionX Engineering" },
          description: { type: "string", example: "Software development and product innovation team" },
          created_by: { type: "integer", example: 1 },
          role: { type: "string", enum: ["owner", "admin", "member"], example: "owner" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          workspace_id: { type: "integer", example: 1 },
          name: { type: "string", example: "WorkSphere API" },
          description: { type: "string", example: "Core backend for WorkSphere" },
          status: { type: "string", enum: ["planning", "active", "completed", "archived"], example: "active" },
          start_date: { type: "string", format: "date", example: "2026-11-01" },
          due_date: { type: "string", format: "date", example: "2026-12-15" },
          total_tasks: { type: "integer", example: 12 },
          completed_tasks: { type: "integer", example: 9 },
          progress_percentage: { type: "integer", example: 75 },
        },
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          project_id: { type: "integer", example: 1 },
          title: { type: "string", example: "Implement Project CRUD" },
          description: { type: "string", example: "Add full CRUD operations for projects with validation" },
          status: { type: "string", enum: ["todo", "in_progress", "review", "done"], example: "in_progress" },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"], example: "high" },
          due_date: { type: "string", format: "date", example: "2026-11-20" },
          assigned_to: { type: "integer", nullable: true, example: 2 },
          assignee_name: { type: "string", nullable: true, example: "Riya Sharma" },
        },
      },
      Activity: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          workspace_id: { type: "integer", example: 1 },
          user_id: { type: "integer", example: 1 },
          user_name: { type: "string", example: "Neeraj Gahlout" },
          action: { type: "string", example: "task_created" },
          entity_type: { type: "string", example: "task" },
          entity_id: { type: "integer", example: 1 },
          details: { type: "object" },
          created_at: { type: "string", format: "date-time" },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  paths: {
    "/api/health": {
      get: {
        summary: "API Health Check",
        tags: ["System"],
        security: [],
        responses: {
          200: { description: "Service is running" },
        },
      },
    },
    "/api/auth/register": {
      post: {
        summary: "Register new user account",
        tags: ["Authentication"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Neeraj Gahlout" },
                  email: { type: "string", format: "email", example: "neeraj@example.com" },
                  password: { type: "string", format: "password", example: "SecurePass123!" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Validation error" },
          409: { description: "Email already registered" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Sign in to account",
        tags: ["Authentication"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "neeraj@example.com" },
                  password: { type: "string", format: "password", example: "SecurePass123!" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful with token" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/profile": {
      get: {
        summary: "Get current user profile",
        tags: ["Authentication"],
        responses: {
          200: { description: "User profile fetched" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/workspaces": {
      get: {
        summary: "List user workspaces",
        tags: ["Workspaces"],
        responses: {
          200: { description: "Workspaces list returned" },
        },
      },
      post: {
        summary: "Create workspace",
        tags: ["Workspaces"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "VisionX Engineering" },
                  description: { type: "string", example: "Product development team workspace" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Workspace created successfully" },
        },
      },
    },
    "/api/workspaces/{workspaceId}": {
      get: {
        summary: "Get workspace details",
        tags: ["Workspaces"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Workspace details" },
          404: { description: "Workspace not found" },
        },
      },
      put: {
        summary: "Update workspace (Owner/Admin)",
        tags: ["Workspaces"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Workspace updated" },
        },
      },
      delete: {
        summary: "Delete workspace (Owner only)",
        tags: ["Workspaces"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Workspace deleted" },
        },
      },
    },
    "/api/workspaces/{workspaceId}/members": {
      get: {
        summary: "List workspace members",
        tags: ["Workspaces"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "List of members with roles" },
        },
      },
      post: {
        summary: "Add member to workspace (Owner/Admin)",
        tags: ["Workspaces"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email" },
                  role: { type: "string", enum: ["admin", "member"], default: "member" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Member added" },
          409: { description: "Already a member" },
        },
      },
    },
    "/api/workspaces/{workspaceId}/projects": {
      get: {
        summary: "List workspace projects",
        tags: ["Projects"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["planning", "active", "completed", "archived"] } },
        ],
        responses: {
          200: { description: "Projects with progress statistics" },
        },
      },
      post: {
        summary: "Create project (Owner/Admin)",
        tags: ["Projects"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "WorkSphere API" },
                  description: { type: "string", example: "Core backend services" },
                  status: { type: "string", enum: ["planning", "active", "completed", "archived"], default: "planning" },
                  start_date: { type: "string", format: "date", example: "2026-11-01" },
                  due_date: { type: "string", format: "date", example: "2026-12-01" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Project created" },
        },
      },
    },
    "/api/workspaces/{workspaceId}/projects/{projectId}": {
      get: {
        summary: "Get project details",
        tags: ["Projects"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
          { name: "projectId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Project details" },
        },
      },
      put: {
        summary: "Update project (Owner/Admin)",
        tags: ["Projects"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
          { name: "projectId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Project updated" },
        },
      },
      delete: {
        summary: "Delete project (Owner/Admin)",
        tags: ["Projects"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
          { name: "projectId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Project deleted" },
        },
      },
    },
    "/api/workspaces/{workspaceId}/projects/{projectId}/tasks": {
      get: {
        summary: "List tasks for project",
        tags: ["Tasks"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
          { name: "projectId", in: "path", required: true, schema: { type: "integer" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["todo", "in_progress", "review", "done"] } },
          { name: "priority", in: "query", schema: { type: "string", enum: ["low", "medium", "high", "urgent"] } },
          { name: "assigned_to", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Tasks list" },
        },
      },
      post: {
        summary: "Create task in project",
        tags: ["Tasks"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
          { name: "projectId", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string", example: "Implement Kanban Board" },
                  description: { type: "string", example: "Support drag-and-drop task movements" },
                  status: { type: "string", enum: ["todo", "in_progress", "review", "done"], default: "todo" },
                  priority: { type: "string", enum: ["low", "medium", "high", "urgent"], default: "medium" },
                  due_date: { type: "string", format: "date", example: "2026-11-25" },
                  assigned_to: { type: "integer", nullable: true },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Task created" },
        },
      },
    },
    "/api/tasks/my": {
      get: {
        summary: "Get tasks assigned to current user across workspaces",
        tags: ["Tasks"],
        responses: {
          200: { description: "Assigned tasks list" },
        },
      },
    },
    "/api/tasks/{taskId}": {
      get: {
        summary: "Get task details",
        tags: ["Tasks"],
        parameters: [
          { name: "taskId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Task details" },
        },
      },
      put: {
        summary: "Update task details",
        tags: ["Tasks"],
        parameters: [
          { name: "taskId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Task updated" },
        },
      },
      delete: {
        summary: "Delete task (Owner/Admin)",
        tags: ["Tasks"],
        parameters: [
          { name: "taskId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Task deleted" },
        },
      },
    },
    "/api/tasks/{taskId}/status": {
      patch: {
        summary: "Quick update task status (Kanban movement)",
        tags: ["Tasks"],
        parameters: [
          { name: "taskId", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["todo", "in_progress", "review", "done"] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Task status updated" },
        },
      },
    },
    "/api/tasks/{taskId}/comments": {
      get: {
        summary: "Get comments for a task",
        tags: ["Collaboration"],
        parameters: [
          { name: "taskId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Comments list" },
        },
      },
      post: {
        summary: "Add comment to a task",
        tags: ["Collaboration"],
        parameters: [
          { name: "taskId", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["comment"],
                properties: {
                  comment: { type: "string", example: "Great progress on this feature!" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Comment added" },
        },
      },
    },
    "/api/workspaces/{workspaceId}/activities": {
      get: {
        summary: "Get workspace activity stream",
        tags: ["Collaboration"],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer", default: 30 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: {
          200: { description: "Activity stream entries" },
        },
      },
    },
  },
};

function setupSwagger(app) {
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
  });

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customSiteTitle: "WorkSphere API Documentation",
      customCss: ".swagger-ui .topbar { display: none }",
    }),
  );
}

module.exports = { setupSwagger, swaggerDocument };
