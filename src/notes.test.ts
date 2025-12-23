import request from "supertest";
import { promises as fs } from "fs";
import path from "path";

import app from "./app.js"; // Express app (no .listen!)

const DB_PATH = path.resolve("DATA.json");
const TEST_DB_PATH = path.resolve("DATA_TEST.json");

describe("Notes API – Full Route Tests", () => {
  /**
   * Reset test database before each test
   */
  beforeEach(async () => {
    const seedData = await fs.readFile(DB_PATH, "utf8");
    await fs.writeFile(TEST_DB_PATH, seedData);
  });

  describe("GET /notes", () => {
    it("returns 200 and paginated response", async () => {
      const res = await request(app).get("/notes");

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        page: expect.any(Number),
        limit: expect.any(Number),
        totalNotes: expect.any(Number),
      });
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("respects pagination query params", async () => {
      const res = await request(app).get("/notes?page=2&limit=5");

      expect(res.status).toBe(200);
      expect(res.body.page).toBe(2);
      expect(res.body.limit).toBe(5);
    });
  });

  describe("POST /notes", () => {
    it("creates a note and returns its ID", async () => {
      const res = await request(app)
        .post("/notes")
        .send({ title: "New", content: "Content" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.id).toEqual(expect.any(Number));
    });

    it("fails validation when title is missing", async () => {
      const res = await request(app)
        .post("/notes")
        .send({ content: "Missing title" });

      expect(res.status).toBe(400);
      expect(res.body.status).toMatch(/validation/i);
    });
  });

  describe("PATCH /notes/:id", () => {
    it("updates a note successfully", async () => {
      const res = await request(app)
        .patch("/notes/4")
        .send({ title: "Updated Title" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 404 for non-existent note", async () => {
      const res = await request(app)
        .patch("/notes/999")
        .send({ title: "Does not exist" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /notes/:id", () => {
    it("deletes a note successfully", async () => {
      const res = await request(app).delete("/notes/6");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /notes/search", () => {
    it("returns filtered notes by keyword", async () => {
      const res = await request(app).get(
        "/notes/search?keyword=Hello"
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
