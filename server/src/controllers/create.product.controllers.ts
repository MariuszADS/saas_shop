import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { getUserOrders } from "@/db/sql/getUserOrders.ts";
import { getOrderById } from "@/db/sql/getOrderById.ts";
import {
  createOrder,
  OrderError,
} from "@/db/sql/createOrder.ts";

import { createProduct } from "@/db/sql/createProduct.ts";

export async function createProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await createProduct({
      name: req.body.name,
      description:
        req.body.description ?? null,
      price: req.body.price,
      stock: req.body.stock,
    });

    return res
      .status(201)
      .json(product);
  } catch (error) {
    next(error);
  }
}

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

    const {
      items,
      shippingAddress,
      paymentMethod,
    } = req.body ?? {};

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message:
          "Order must contain at least one item",
      });
    }

    for (const item of items) {
      if (
        !item ||
        !Number.isSafeInteger(
          item.productId
        ) ||
        item.productId <= 0 ||
        !Number.isSafeInteger(
          item.quantity
        ) ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          message: "Invalid order item",
        });
      }
    }

    if (
      new Set(
        items.map(
          (item) => item.productId
        )
      ).size !== items.length
    ) {
      return res.status(400).json({
        message:
          "Duplicate product IDs are not allowed",
      });
    }

    if (
      !shippingAddress ||
      typeof shippingAddress !==
        "object"
    ) {
      return res.status(400).json({
        message:
          "Shipping address is required",
      });
    }

    const {
      name,
      address,
      city,
      postalCode,
      country,
    } = shippingAddress;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof address !== "string" ||
      !address.trim() ||
      typeof city !== "string" ||
      !city.trim() ||
      typeof postalCode !== "string" ||
      !postalCode.trim() ||
      typeof country !== "string" ||
      !country.trim()
    ) {
      return res.status(400).json({
        message:
          "Invalid shipping address",
      });
    }

    if (
      paymentMethod !== "vipps" &&
      paymentMethod !== "klarna"
    ) {
      return res.status(400).json({
        message:
          "Invalid payment method",
      });
    }

    const order = await createOrder({
      userId: req.user.userId,

      items,

      shippingAddress: {
        name: name.trim(),
        address: address.trim(),
        city: city.trim(),
        postalCode:
          postalCode.trim(),
        country: country.trim(),
      },

      paymentMethod,
    });

    return res
      .status(201)
      .json(order);
  } catch (error) {
    if (
      error instanceof OrderError
    ) {
      return res
        .status(error.status)
        .json({
          message: error.message,
        });
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

    const orderId = Number(
      req.params.id
    );

    if (Number.isNaN(orderId)) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }

    const order =
      await getOrderById(
        orderId,
        req.user.userId
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res
      .status(200)
      .json(order);
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

    const orders =
      await getUserOrders(
        req.user.userId
      );

    return res
      .status(200)
      .json(orders);
  } catch (error) {
    next(error);
  }
}