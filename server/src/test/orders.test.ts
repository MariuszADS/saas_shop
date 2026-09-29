import request from "supertest";
import { describe, it, expect } from "vitest";

import { app } from "@/index.ts";

describe("Orders API", () => {
  it("should return 401 without token", async () => {
    const response = await request(app)
      .get("/api/orders/me");

    expect(response.status).toBe(401);
  });
});