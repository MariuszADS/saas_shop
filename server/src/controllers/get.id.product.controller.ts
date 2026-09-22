import type { Request, Response, NextFunction } from "express";
import { getProductById } from "@/db/sql/getIdproduct.ts";

export async function getProductByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}