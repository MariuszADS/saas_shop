import type {
  Request,
  Response,
  NextFunction,
} from "express";
import { getUserOrders } from "@/db/sql/getUserOrders.ts";
import { getOrderById } from "@/db/sql/getOrderById.ts";
import { createOrder, OrderError } from "@/db/sql/createOrder.ts";



export async function createOrderController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const items = req.body?.items;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    for (const item of items) {
      if (
        !item ||
        !Number.isSafeInteger(item.productId) ||
        item.productId <= 0 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          message: "Invalid order item",
        });
      }
    }

    if (new Set(items.map((item) => item.productId)).size !== items.length) {
      return res.status(400).json({ message: "Duplicate product IDs are not allowed" });
    }

    const order = await createOrder({
      userId: req.user.userId,
      items,
    });

    return res.status(201).json(order);
  } catch (error) {
    if (error instanceof OrderError) {
      return res.status(error.status).json({ message: error.message });
    }
    next(error);
  }
}

export async function getOrderByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const orderId = Number(req.params.id);

    if (Number.isNaN(orderId)) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }

    const order = await getOrderById(
      orderId,
      req.user.userId
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

export async function getMyOrdersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const orders = await getUserOrders(
      req.user.userId
    );

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}