import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../rbac";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as { id: string; role: Role };
    
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};