import type {
  Request,
  Response,
  NextFunction,
} from "express";

import bcrypt from "bcrypt";

import { createUser } from "@/db/sql/createUser.ts";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    const user = await createUser({
      email: normalizedEmail,
      passwordHash,
    });

    return res.status(201).json({
      user,
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return res.status(409).json({
        message:
          "An account with this email already exists. Log in instead.",
      });
    }

    next(error);
  }
}