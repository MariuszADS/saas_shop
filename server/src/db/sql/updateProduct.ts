import { pool } from "@/db/db.ts";

interface UpdateProductInput {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
  active?: boolean;
  imageUrl?: string;
}

export async function updateProduct(
  productId: number,
  input: UpdateProductInput
) {
  const result = await pool.query(
    `
    UPDATE products
    SET
      name = COALESCE($2, name),
      description = COALESCE($3, description),
      price = COALESCE($4, price),
      stock = COALESCE($5, stock),
      active = COALESCE($6, active)
    WHERE id = $1
    RETURNING *
    `,
    [
      productId,
      input.name ?? null,
      input.description ?? null,
      input.price ?? null,
      input.stock ?? null,
      input.active ?? null,
    ]
  );

  return result.rows[0];
}