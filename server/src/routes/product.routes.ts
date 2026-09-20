import { Router } from "express";
import { deleteProduct } from "@/db/sql/deleteProduct.ts";

const router = Router();

router.delete("/:id", async (req, res) => {
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
});

export default router