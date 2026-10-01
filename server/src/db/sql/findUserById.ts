import { pool } from "@/db/db.ts";

export async function findUserById(
  userId: number
) {
  const result = await pool.query(
    `
    SELECT
      id,
      email,
      role
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  return result.rows[0];
}