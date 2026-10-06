import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { updateProduct } from "@/db/sql/updateProduct.ts";

export async function updateProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const {
      name,
      description,
      price,
      stock,
      active,
    } = req.body ?? {};

    const product = await updateProduct(
      productId,
      {
        name,
        description,
        price,
        stock,
        active,
      }
    );

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