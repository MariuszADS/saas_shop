import { deleteProduct } from "@/db/sql/deleteProduct.ts"
import type { Request, Response, NextFunction } from "express";
export async function deleteProductController(
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

        const deletedProduct = await deleteProduct(id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json(deletedProduct);
    } catch (error) {
        next(error);
    }
}