import { pool } from "@/db/db.ts";

interface CreateProductInput {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
}

export async function createProduct(
  input: CreateProductInput
) {
  const result = await pool.query(
    `
    INSERT INTO products (
      name,
      description,
      price,
      stock,
      image_url
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      input.name,
      input.description,
      input.price,
      input.stock,
      input.imageUrl,
    ]
  );

  return result.rows[0];
}