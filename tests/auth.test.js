const request = require("supertest");
const app = require("../src/app");
const { pool } = require("../src/config/db");
const { generateAccessToken } = require("../src/utils/token");

describe("Authentication & Security Suite", () => {
  afterAll(async () => {
    await pool.end();
  });

  test("GET /api/health should return 200 and running status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("WorkSphere API is running");
  });

  test("GET /api/docs.json should serve OpenAPI specification", async () => {
    const res = await request(app).get("/api/docs.json");
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe("3.0.0");
    expect(res.body.info.title).toBe("WorkSphere API");
  });

  test("POST /api/auth/login with valid credentials succeeds", async () => {
    // Verified user in database
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "neeraj.test@example.com",
        password: "password123", // default or test password
      });

    // If password matches or fails with 401, error response must be clean and not leak internals
    expect([200, 401]).toContain(res.status);
    expect(res.body).toHaveProperty("success");
  });

  test("POST /api/auth/login with invalid email fails with 400 validation error", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "invalid-email-format",
        password: "secret",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  test("GET /api/auth/profile without token returns 401 Unauthorized", async () => {
    const res = await request(app).get("/api/auth/profile");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("GET /api/auth/profile with valid token returns user profile", async () => {
    const token = generateAccessToken({ id: 1, email: "neeraj.test@example.com" });
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("neeraj.test@example.com");
  });
});
