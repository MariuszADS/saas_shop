import { Router } from "express";
import { createProductController } from "@/controllers/create.product.controllers.ts";
import { getProductsController } from "@/controllers/get.all.products.controller.ts";
import { getProductByIdController } from "@/controllers/get.id.product.controller.ts";
import { deleteProductController } from "@/controllers/delete.product.controller.ts";

import { authenticate } from "@/middleware/auth.middleware.ts";
import { requireAdmin } from "@/middleware/role.middleware.ts";

const router = Router();

router.get("/", getProductsController);
router.get("/:id", getProductByIdController);
router.post("/", authenticate, requireAdmin, createProductController);

router.delete("/:id", authenticate, requireAdmin, deleteProductController);

export default router;