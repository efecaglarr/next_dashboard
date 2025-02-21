import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userId?: string;
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  if (!process.env.JWT_SECRET_KEY) {
    return res
      .status(500)
      .json({ message: "Server error: Missing JWT secret." });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    async (err: jwt.VerifyErrors | null, payload: any) => {
      if (err) return res.status(403).json({ message: "Not Valid Token!" });
      req.userId = (payload as { id: string }).id;
      next();
    }
  );
};

export const requireAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  if (!process.env.JWT_SECRET_KEY) {
    return res
      .status(500)
      .json({ message: "Server error: Missing JWT secret." });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (err: jwt.VerifyErrors | null, payload: any) => {
      if (err) {
        console.log("Invalid token:", err.message);
        return res.status(403).json({ message: "Not Valid Token!" });
      }
      if (!(payload as { isAdmin: boolean }).isAdmin) {
        console.log("User is not an admin:", payload);
        return res.status(403).json({ message: "Not Authorized!" });
      }
      req.userId = (payload as { id: string }).id;
      next();
    }
  );
};
