import { Router } from "express";

import { getProductsController } from "@/controllers/product.controller.ts";
import { getProductByIdController } from "@/controllers/get.id.product.controller.ts";
import { createProductController } from "@/controllers/create.product.controllers.ts";
import { deleteProductController } from "@/controllers/delete.product.controller.ts";
import { updateProductController } from "@/controllers/update.product.controller.ts";
import { authenticate } from "@/middleware/auth.middleware.ts";
import { requireAdmin } from "@/middleware/role.middleware.ts";

const router = Router();

router.get(
  "/",
  getProductsController
);

router.get(
  "/:id",
  getProductByIdController
);

router.post(
  "/",
  authenticate,
  requireAdmin,
  createProductController
);

router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteProductController
);

router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  updateProductController
);

export default router;