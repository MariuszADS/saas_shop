import type { Request, Response, NextFunction } from "express";
import { getProducts } from "@/db/sql/fetchProducts.ts";

export async function getProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await getProducts();

    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}