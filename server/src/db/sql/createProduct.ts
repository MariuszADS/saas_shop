import { pool } from "@/db/db.ts"

// db/sql/createProduct.ts
type CreateProductInput = {
  name: string;
  description: string | null;
  price: number;
  stock: number;
};

export async function createProduct(input: CreateProductInput) {
  const result = await pool.query(
    `
      INSERT INTO products (name, description, price, stock)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, description, price, stock
    `,
    [input.name, input.description, input.price, input.stock]
  );

  return result.rows[0];
}