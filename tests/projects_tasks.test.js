const request = require("supertest");
const app = require("../src/app");
const { pool } = require("../src/config/db");
const { generateAccessToken } = require("../src/utils/token");

describe("Projects & Tasks Security and Data Isolation Suite", () => {
  let ownerToken;
  let memberToken;
  let testProjectId;
  let testTaskId;

  beforeAll(() => {
    ownerToken = generateAccessToken({ id: 1, email: "neeraj.test@example.com" });
    memberToken = generateAccessToken({ id: 2, email: "member.test@example.com" });
  });

  afterAll(async () => {
    // Clean up test records if any remain
    if (testTaskId) {
      await pool.execute("DELETE FROM tasks WHERE id = ?", [testTaskId]);
    }
    if (testProjectId) {
      await pool.execute("DELETE FROM projects WHERE id = ?", [testProjectId]);
    }
    await pool.end();
  });

  test("GET /api/workspaces/1/members lists workspace members with roles", async () => {
    const res = await request(app)
      .get("/api/workspaces/1/members")
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.members)).toBe(true);
    expect(res.body.data.count).toBeGreaterThanOrEqual(1);
  });

  test("Regular member cannot create project (403 Forbidden)", async () => {
    const res = await request(app)
      .post("/api/workspaces/1/projects")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({
        name: "Unauthorized Member Project",
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test("Owner can create a new project in workspace (201 Created)", async () => {
    const res = await request(app)
      .post("/api/workspaces/1/projects")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        name: "Jest Automated Test Project",
        description: "Created during integration testing",
        status: "active",
        start_date: "2026-11-01",
        due_date: "2026-12-01",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    testProjectId = res.body.data.project.id;
    expect(testProjectId).toBeDefined();
  });

  test("Task assignment rejects non-workspace member (400 Bad Request)", async () => {
    const res = await request(app)
      .post(`/api/workspaces/1/projects/${testProjectId}/tasks`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        title: "Malicious Task Cross-Assignment",
        assigned_to: 99999, // Non-member
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Assigned user is not a member of this workspace");
  });

  test("Task can be created and assigned to valid workspace member", async () => {
    const res = await request(app)
      .post(`/api/workspaces/1/projects/${testProjectId}/tasks`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        title: "Build Integration Tests",
        description: "Verify endpoint responses and data isolation",
        status: "todo",
        priority: "high",
        due_date: "2026-11-25",
        assigned_to: 2, // Member
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    testTaskId = res.body.data.task.id;
    expect(res.body.data.task.assigned_to).toBe(2);
  });

  test("Quick task status change (PATCH status) updates status and logs activity", async () => {
    const res = await request(app)
      .patch(`/api/workspaces/1/tasks/${testTaskId}/status`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ status: "in_progress" });

    expect(res.status).toBe(200);
    expect(res.body.data.task.status).toBe("in_progress");
  });

  test("Collaboration: member can post comment on task", async () => {
    const res = await request(app)
      .post(`/api/tasks/${testTaskId}/comments`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({
        comment: "Test comment verifying collaboration thread",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.comment.comment).toBe("Test comment verifying collaboration thread");
  });

  test("Workspace activity stream includes recent project and task events", async () => {
    const res = await request(app)
      .get("/api/workspaces/1/activities")
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.activities.length).toBeGreaterThanOrEqual(1);
  });

  test("Owner can clean up test task and project", async () => {
    const delTask = await request(app)
      .delete(`/api/tasks/${testTaskId}`)
      .set("Authorization", `Bearer ${ownerToken}`);
    expect(delTask.status).toBe(200);
    testTaskId = null;

    const delProj = await request(app)
      .delete(`/api/workspaces/1/projects/${testProjectId}`)
      .set("Authorization", `Bearer ${ownerToken}`);
    expect(delProj.status).toBe(200);
    testProjectId = null;
  });
});
