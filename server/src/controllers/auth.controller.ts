import type {
    Request,
    Response,
    NextFunction
} from "express";

import bcrypt from "bcrypt";
import { createUser } from "@/db/sql/createUser.ts";

export async function register(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await createUser({
            email,
            passwordHash,
        });

        return res.status(201).json(user);

    } catch (error) {
        next(error);
    }
}