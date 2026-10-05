import { Router } from "express";
import { getAdminOrders } from "@/controllers/adminOrder.controller.ts";
import { authenticate } from "@/middleware/auth.middleware.ts";
import { requireAdmin } from "@/middleware/role.middleware.ts";

import {
  updateOrderStatusController,
} from "@/controllers/adminOrder.controller.ts";

const router = Router();

router.patch(
  "/:id/status",
  authenticate,
  requireAdmin,
  updateOrderStatusController
);


router.get(
  "/",
  authenticate,
  requireAdmin,
  getAdminOrders
);
export default router;