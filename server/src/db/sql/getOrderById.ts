import { pool } from "@/db/db.ts";

export async function getOrderById(
  orderId: number,
  userId: number
) {
  const result = await pool.query(
    `
    SELECT
      o.id,
      o.status,
      o.total,
      o.created_at,
      o.updated_at,
      COALESCE(
        json_agg(
          json_build_object(
            'productId', oi.product_id,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price
          )
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi
      ON oi.order_id = o.id
    WHERE o.id = $1
      AND o.user_id = $2
    GROUP BY o.id
    `,
    [orderId, userId]
  );

  return result.rows[0];
}