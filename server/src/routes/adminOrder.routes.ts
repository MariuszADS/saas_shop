import { Router } from "express";

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

export default router;