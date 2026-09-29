import { Router } from "express";

import { authenticate } from "@/middleware/auth.middleware.ts";
import {
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
} from "@/controllers/order.controller.ts";

const router = Router();
router.get(
  "/me",
  authenticate,
  getMyOrdersController
);
router.get(
  "/:id",
  authenticate,
  getOrderByIdController
);

router.post(
  "/",
  authenticate,
  createOrderController
);


export default router;