import { pool } from "@/db/db.ts";

export async function getAllOrders() {
  const result = await pool.query(`
    SELECT
      o.id,
      o.user_id,
      o.status,
      o.total,
      o.created_at,
      o.updated_at,
      u.email,
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
    JOIN users u
      ON u.id = o.user_id
    LEFT JOIN order_items oi
      ON oi.order_id = o.id
    GROUP BY
      o.id,
      u.email
    ORDER BY o.created_at DESC
  `);

  return result.rows;
}