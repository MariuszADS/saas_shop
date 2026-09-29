import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { updateOrderStatus } from "@/db/sql/updateOrderStatus.ts";
import type { OrderStatus } from "@/types/order.ts";

const allowedStatuses: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export async function updateOrderStatusController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (Number.isNaN(orderId)) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status as OrderStatus)
    ) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await updateOrderStatus(
      orderId,
      status as OrderStatus
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}