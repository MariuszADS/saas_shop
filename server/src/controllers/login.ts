import bcrypt from "bcrypt";
import { generateAccessToken } from "@/utils/jwt.ts";
import type { Request, Response, NextFunction } from "express";
import { findUserByEmail } from "@/db/sql/findUserByEmail.ts";

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body ?? {};

    if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user.id, user.role);

    return res.status(200).json({
      accessToken,
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
}

