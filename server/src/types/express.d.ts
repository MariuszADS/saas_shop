import type { AccessTokenPayload } from "../utils/jwt.ts";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<AccessTokenPayload, "userId" | "role">;
    }
  }
}

export {};
