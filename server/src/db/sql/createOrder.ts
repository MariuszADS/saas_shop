import { pool } from "@/db/db.ts";
import type { CreateOrderInput } from "@/types/order.ts";

export class OrderError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
  }
}

export async function createOrder({
  userId,
  items,
  shippingAddress,
  paymentMethod,
}: CreateOrderInput) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const productIds = items.map(
      (item) => item.productId
    );

    const productsResult = await client.query(
      `
      SELECT id, price, stock
      FROM products
      WHERE id = ANY($1::int[])
      ORDER BY id
      FOR UPDATE
      `,
      [productIds]
    );

    if (
      productsResult.rows.length !==
      items.length
    ) {
      throw new OrderError(
        404,
        "One or more products do not exist"
      );
    }

    let total = 0;

    for (const item of items) {
      const product =
        productsResult.rows.find(
          (product) =>
            product.id === item.productId
        );

      if (!product) {
        throw new OrderError(
          404,
          "Product not found"
        );
      }

      if (
        product.stock <
        item.quantity
      ) {
        throw new OrderError(
          409,
          `Not enough stock for product ${item.productId}`
        );
      }

      total +=
        Number(product.price) *
        item.quantity;
    }

    const orderResult =
      await client.query(
        `
        INSERT INTO orders (
          user_id,
          total,
          shipping_name,
          shipping_address,
          shipping_city,
          shipping_postal_code,
          shipping_country,
          payment_method,
          payment_status
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9
        )
        RETURNING *
        `,
        [
          userId,
          total,
          shippingAddress.name,
          shippingAddress.address,
          shippingAddress.city,
          shippingAddress.postalCode,
          shippingAddress.country,
          paymentMethod,
          "authorized",
        ]
      );

    const order =
      orderResult.rows[0];

    for (const item of items) {
      const product =
        productsResult.rows.find(
          (product) =>
            product.id === item.productId
        );

      if (!product) {
        throw new OrderError(
          404,
          "Product not found"
        );
      }

      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          unit_price
        )
        VALUES ($1, $2, $3, $4)
        `,
        [
          order.id,
          item.productId,
          item.quantity,
          product.price,
        ]
      );

      await client.query(
        `
        UPDATE products
        SET stock = stock - $1
        WHERE id = $2
        `,
        [
          item.quantity,
          item.productId,
        ]
      );
    }

    await client.query("COMMIT");

    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}