import { Router } from "express";
import {createProductController,} from "@/controllers/create.product.controllers.ts";
import { getProductsController } from "@/controllers/get.all.products.controller.ts";
import { getProductByIdController } from "@/controllers/get.id.product.controller.ts";
import { deleteProductController } from "@/controllers/delete.product.controller.ts";

const router = Router();

router.get("/", getProductsController);

router.get("/:id", getProductByIdController);

router.post("/", createProductController);

router.delete("/:id", deleteProductController);

export default router;