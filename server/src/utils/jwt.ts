import "dotenv/config";
import jwt, { type JwtPayload } from "jsonwebtoken";

export type UserRole = "user" | "admin";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

const JWT_SECRET = getJwtSecret();

export function generateAccessToken(
  userId: number,
  role: UserRole
): string {
  return jwt.sign(
    {
      userId,
      role,
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

export interface AccessTokenPayload extends JwtPayload {
  userId: number;
  role: UserRole;
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });

  if (
    typeof payload === "string" ||
    !Number.isSafeInteger(payload.userId) || payload.userId <= 0 ||
    (payload.role !== "user" && payload.role !== "admin") ||
    typeof payload.exp !== "number"
  ) {
    throw new Error("Invalid access token payload");
  }

  return payload as AccessTokenPayload;
}
