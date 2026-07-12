import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
