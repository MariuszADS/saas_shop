import { pool } from "@/db/db.ts";
import type { ProductQuery } from "@/types/products.ts";

export async function getProducts(query: ProductQuery) {
  const {
    search,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 10,
  } = query;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (search) {
    values.push(`%${search}%`);

    conditions.push(`
      (
        name ILIKE $${values.length}
        OR description ILIKE $${values.length}
      )
    `);
  }

  if (minPrice !== undefined) {
    values.push(minPrice);

    conditions.push(
      `price >= $${values.length}`
    );
  }

  if (maxPrice !== undefined) {
    values.push(maxPrice);

    conditions.push(
      `price <= $${values.length}`
    );
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  let orderBy = "created_at DESC, id DESC";

  if (sort === "price_asc") {
    orderBy = "price ASC, id ASC";
  }

  if (sort === "price_desc") {
    orderBy = "price DESC, id ASC";
  }

  if (sort === "newest") {
    orderBy = "created_at DESC, id DESC";
  }

  const offset = (page - 1) * limit;

  values.push(limit);
  const limitParameter = values.length;

  values.push(offset);
  const offsetParameter = values.length;

  const result = await pool.query(
    `
    SELECT *
    FROM products
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT $${limitParameter}
    OFFSET $${offsetParameter}
    `,
    values
  );

  return result.rows;
}