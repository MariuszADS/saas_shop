import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { getProducts } from "@/db/sql/getProducts.ts";

export async function getProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const minPrice = req.query.minPrice
      ? Number(req.query.minPrice)
      : undefined;

    const maxPrice = req.query.maxPrice
      ? Number(req.query.maxPrice)
      : undefined;

    const sort =
      typeof req.query.sort === "string"
        ? req.query.sort
        : undefined;

    const page = req.query.page
      ? Number(req.query.page)
      : 1;

    const limit = req.query.limit
      ? Number(req.query.limit)
      : 10;

    if (!Number.isSafeInteger(page) || !Number.isSafeInteger(limit) || page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        message: "Invalid pagination values",
      });
    }

    if (
      minPrice !== undefined &&
      !Number.isFinite(minPrice)
    ) {
      return res.status(400).json({
        message: "Invalid minPrice",
      });
    }

    if (
      maxPrice !== undefined &&
      !Number.isFinite(maxPrice)
    ) {
      return res.status(400).json({
        message: "Invalid maxPrice",
      });
    }

    const allowedSort = [
      "price_asc",
      "price_desc",
      "newest",
    ];

    if (
      sort &&
      !allowedSort.includes(sort)
    ) {
      return res.status(400).json({
        message: "Invalid sort value",
      });
    }

    const products = await getProducts({
      search,
      minPrice,
      maxPrice,
      sort: sort as
        | "price_asc"
        | "price_desc"
        | "newest"
        | undefined,
      page,
      limit,
    });

    return res.status(200).json({
      page,
      limit,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
}