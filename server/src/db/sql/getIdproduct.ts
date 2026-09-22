import { pool } from "@/db/db.ts";

export async function getProductById(id: number) {
  const result = await pool.query(
    `
    SELECT *
    FROM products
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}