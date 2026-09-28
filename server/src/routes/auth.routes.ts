import { Router } from "express";
import { register } from "@/controllers/auth.controller.ts";
import { login } from "@/controllers/login.ts";

import { authenticate } from "@/middleware/auth.middleware.ts";
import { getProfile } from "@/controllers/profile.controller.ts";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);

export default router;