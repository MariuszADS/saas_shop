import type { Request, Response } from "express";

export function getProfile(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json(req.user);
}
