import bcrypt from "bcrypt";
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


describe("registration and login", () => {
  const email = "auth-test@example.invalid";
  const password = "test-password-for-auth";

  it("stores a bcrypt hash and logs in with the original password only", async () => {
    const user = { id: 42, email, role: "user" };
    query.mockResolvedValueOnce({ rows: [user] });
    const registration = await request(app).post("/api/auth/register").send({ email, password });
    expect(registration.status).toBe(201);
    expect(registration.body).toEqual(user);
    const storedHash = query.mock.calls[0]![1][1];
    expect(storedHash).not.toBe(password);
    expect(await bcrypt.compare(password, storedHash)).toBe(true);
    query.mockResolvedValue({ rows: [{ ...user, password_hash: storedHash }] });
    const login = await request(app).post("/api/auth/login").send({ email, password });
    expect(login.status).toBe(200);
    expect(jwt.verify(login.body.accessToken, secret)).toMatchObject({ userId: 42, role: "user" });
    expect(login.body).not.toHaveProperty("password_hash");
    for (const wrongPassword of ["wrong-password", storedHash]) {
      const response = await request(app).post("/api/auth/login").send({ email, password: wrongPassword });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Invalid credentials" });
    }
  });

  it("returns JSON 409 when the email already exists", async () => {
    query.mockResolvedValueOnce({ rows: [] });
    const response = await request(app).post("/api/auth/register").send({ email, password });
    expect(response.status).toBe(409);
    expect(response.type).toBe("application/json");
    expect(response.body.message).toContain("already exists");
  });

  it("rejects malformed credentials without querying the database", async () => {
    for (const route of ["register", "login"]) {
      for (const body of [{}, { email, password: 123 }, { email: {}, password }, { email: " ", password }]) {
        expect((await request(app).post(`/api/auth/${route}`).send(body)).status).toBe(400);
      }
      expect((await request(app).post(`/api/auth/${route}`)).status).toBe(400);
    }
    expect(query).not.toHaveBeenCalled();
  });

  it("rejects an unknown user", async () => {
    query.mockResolvedValueOnce({ rows: [] });
    const response = await request(app).post("/api/auth/login").send({ email, password });
    expect(response.status).toBe(401);
  });
});
