import { pool } from "@/db/db.ts";
import type { OrderStatus } from "@/types/order.ts";

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus
) {
  const result = await pool.query(
    `
    UPDATE orders
    SET
      status = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING
      id,
      user_id,
      status,
      total,
      created_at,
      updated_at
    `,
    [status, orderId]
  );

  return result.rows[0];
}