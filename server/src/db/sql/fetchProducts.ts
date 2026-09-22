import { pool } from "@/db/db.ts";

export async function getProducts() {
  const result = await pool.query(
    `
    SELECT *
    FROM products
    ORDER BY id ASC
    `
  );

  return result.rows;
}