// Uruchomienie: npx tsx test-orders.ts (wymaga działającego lokalnego API).
// Tworzy tymczasowego użytkownika, produkty i zamówienie; usuwa je po teście.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { pool } from "./src/db/db.ts";

const baseUrl = "http://localhost:3000";
function post(path: string, body: unknown, token?: string) {
  const config = token ? `header = "Authorization: Bearer ${token}"\n` : "";
  const output = execFileSync("curl", ["--silent", "--show-error", "--max-time", "15",
    "--config", "-", "--request", "POST", `${baseUrl}${path}`,
    "--header", "Content-Type: application/json", "--data", JSON.stringify(body),
    "--write-out", "\n%{http_code}"], { input: config, encoding: "utf8" });
  const split = output.lastIndexOf("\n");
  return { status: Number(output.slice(split + 1)), body: JSON.parse(output.slice(0, split)) };
}

let userId: number | undefined;
const productIds: number[] = [];
try {
  const credentials = { email: `order-test-${randomUUID()}@example.invalid`, password: randomUUID() };
  const registered = post("/api/auth/register", credentials);
  assert.equal(registered.status, 201);
  userId = registered.body.id;
  const login = post("/api/auth/login", credentials);
  assert.equal(login.status, 200);
  const token = login.body.accessToken;
  assert.equal(typeof token, "string");
  const original = { items: [{ productId: 1, quantity: 2 }, { productId: 3, quantity: 1 }] };
  assert.equal(post("/api/orders", original, "TWOJ_TOKEN").status, 401);
  console.log("OK: placeholder token → 401");
  // Oryginalne żądanie wykonujemy tylko przy brakującym produkcie, aby nie kupować istniejących produktów.
  const existing = await pool.query("SELECT id FROM products WHERE id IN (1, 3)");
  if (existing.rows.length < 2) {
    const missing = post("/api/orders", original, token);
    assert.equal(missing.status, 404);
    console.log(`OK: oryginalne pozycje + prawidłowy token → 404 (${missing.body.message})`);
  }
  for (const items of [[], [null], [{ productId: 3, quantity: 1.5 }],
    [{ productId: 3, quantity: 0 }], [{ productId: 3, quantity: 1 }, { productId: 3, quantity: 1 }]]) {
    assert.equal(post("/api/orders", { items }, token).status, 400);
  }
  assert.equal(post("/api/orders", {}, token).status, 400);
  console.log("OK: niepoprawne pozycje → 400");
  for (const price of [12.50, 20]) {
    const result = await pool.query("INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING id",
      [`order-test-${randomUUID()}`, price, 5]);
    productIds.push(result.rows[0].id);
  }
  const insufficient = post("/api/orders", { items: [{ productId: productIds[0], quantity: 6 }] }, token);
  assert.equal(insufficient.status, 409);
  const created = post("/api/orders", { items: [
    { productId: productIds[0], quantity: 2 }, { productId: productIds[1], quantity: 1 },
  ] }, token);
  assert.equal(created.status, 201);
  assert.equal(Number(created.body.total), 45);
  const stock = await pool.query("SELECT stock FROM products WHERE id = ANY($1::int[]) ORDER BY id", [productIds]);
  assert.deepEqual(stock.rows.map(row => row.stock), [3, 4]);
  const items = await pool.query("SELECT quantity, unit_price FROM order_items WHERE order_id = $1 ORDER BY product_id", [created.body.id]);
  assert.deepEqual(items.rows.map(row => [row.quantity, Number(row.unit_price)]), [[2, 12.5], [1, 20]]);
  const orders = await pool.query("SELECT id FROM orders WHERE user_id = $1", [userId]);
  assert.equal(orders.rows.length, 1, "Nieudane żądania nie mogą pozostawiać zamówień");
  console.log("OK: brak zapasu → 409; zamówienie → 201, total=45, pozycje i magazyn poprawne");
} finally {
  try {
    if (userId !== undefined) {
      await pool.query("DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = $1)", [userId]);
      await pool.query("DELETE FROM orders WHERE user_id = $1", [userId]);
      await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    }
    if (productIds.length) await pool.query("DELETE FROM products WHERE id = ANY($1::int[])", [productIds]);
    console.log("Usunięto dane utworzone przez test.");
  } finally {
    await pool.end();
  }
}
