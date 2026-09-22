import { pool } from "@/db/db.ts";

interface CreateUserInput {
    email: string;
    passwordHash: string;
}

export async function createUser({
    email,
    passwordHash,
}: CreateUserInput) {
    const result = await pool.query(
        `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, role, created_at
    `,
        [email, passwordHash]
    );

    return result.rows[0];
}