import { pool } from "@/db/db.ts";

export async function findUserByEmail(email: string) {
  const result = await pool.query(
    `
    SELECT id, email, password_hash, role, created_at
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  return result.rows[0];
}