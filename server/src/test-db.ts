import { pool } from "@/db/db.ts";

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("DB connected");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("DB connection failed:", error);
  }
}

testConnection();