import type { Request, Response, NextFunction } from "express";

import { createProduct } from "@/db/sql/createProduct.ts";
// import { getProducts } from "@/db/sql/getProducts.ts";
// import { getProductById } from "@/db/sql/getProductById.ts";
// import { deleteProduct } from "@/db/sql/deleteProduct.ts";

export async function createProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await createProduct({
      name: req.body.name,
      description: req.body.description ?? null,
      price: req.body.price,
      stock: req.body.stock,
    });

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}