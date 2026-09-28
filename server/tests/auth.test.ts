import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";

const { query, secret } = vi.hoisted(() => {
  const secret = "isolated-test-secret-not-for-production";
  process.env.JWT_SECRET = secret;
  return { query: vi.fn(), secret };
});
vi.mock("../src/db/db.ts", () => ({ pool: { query } }));

import authRoutes from "../src/routes/auth.routes.ts";
import productRoutes from "../src/routes/product.routes.ts";
import { generateAccessToken } from "../src/utils/jwt.ts";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

beforeEach(() => query.mockReset());

describe("JWT authentication", () => {
  it("returns the authenticated profile without querying the database", async () => {
    const token = generateAccessToken(42, "user");
    const response = await request(app).get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userId: 42, role: "user" });
    expect(query).not.toHaveBeenCalled();
  });

  it("rejects missing, malformed, forged, expired and invalid-claim tokens", async () => {
    const sign = (payload: object) => jwt.sign(payload, secret);
    const valid = generateAccessToken(42, "user");
    const headers = [undefined, "Basic abc", "Bearer invalid", `Bearer ${valid} extra`,
      `Bearer ${jwt.sign({ userId: 42, role: "admin" }, "wrong-secret")}`,
      `Bearer ${sign({ userId: 42, role: "user", exp: 1 })}`,
      `Bearer ${sign({ userId: 42, role: "superadmin", exp: 9999999999 })}`,
      `Bearer ${sign({ userId: "42", role: "user", exp: 9999999999 })}`,
      `Bearer ${sign({ userId: 42, role: "user" })}`];
    for (const header of headers) {
      const req = request(app).get("/api/auth/profile");
      if (header) req.set("Authorization", header);
      expect((await req).status).toBe(401);
    }
    expect(query).not.toHaveBeenCalled();
  });
});

describe("product permissions", () => {
  for (const method of ["post", "delete"] as const) {
    const path = method === "post" ? "/api/products" : "/api/products/12";
    it(`${method}: rejects anonymous and regular users before database access`, async () => {
      expect((await request(app)[method](path).send({})).status).toBe(401);
      const response = await request(app)[method](path)
        .set("Authorization", `Bearer ${generateAccessToken(42, "user")}`).send({});
      expect(response.status).toBe(403);
      expect(query).not.toHaveBeenCalled();
    });
    it(`${method}: allows administrators`, async () => {
      query.mockResolvedValue({ rows: [{ id: 12, name: "Test product" }] });
      const response = await request(app)[method](path)
        .set("Authorization", `Bearer ${generateAccessToken(42, "admin")}`)
        .send({ name: "Test product", price: 10, stock: 1 });
      expect(response.status).toBe(method === "post" ? 201 : 200);
      expect(query).toHaveBeenCalledOnce();
    });
  }
});
