import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { User } from "@prisma/client";


interface AuthenticatedRequest extends Request {
  user?: User; 
}

export const createAdmin = async (req: AuthenticatedRequest, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Ensuring only authorized users can create admin accounts
    if (!req.user || !(req.user.role === "ADMIN")) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log(newAdmin);
    res.status(201).json({ message: "Admin account created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create admin account." });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);
    res.status(201).json({ message: "User created succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create an user" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials!" });

    const age = 1000 * 3600 * 24 * 7; // 7 days

    const isAdmin = user.role === "ADMIN";
    
    if (!process.env.JWT_SECRET_KEY) {
      return res
        .status(500)
        .json({ message: "Server error: Missing JWT secret." });
    }
    const token = jwt.sign(
      {
        id: user.userId,
        isAdmin, // Add isAdmin to the token
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true // Uncomment this in production for HTTPS
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful!" });
};
