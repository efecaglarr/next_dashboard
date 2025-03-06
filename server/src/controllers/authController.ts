import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { User } from "@prisma/client";
import { googleClient } from '../config/google.config';


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

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params; // Assuming the user ID is passed as a URL parameter

  try {
    // Ensuring only authorized users (Admins) can delete accounts
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.user.delete({
      where: { userId },
    });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user." });
  }
};


export const register = async (req: Request, res: Response) => {
  const { username, email, password, isTenant } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Generate token for the new user
    const token = jwt.sign(
      {
        id: newUser.userId,
        isAdmin: newUser.role === "ADMIN",
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '7d' }
    );

    // If the user is registering as a tenant, redirect to tenant creation
    const response = {
      message: "User created successfully",
      user: {
        userId: newUser.userId,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      token,
      isTenant
    };

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      })
      .status(201)
      .json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create an user" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      },
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials!" });

    if (!user.password) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials!" });

    const token = jwt.sign(
      {
        id: user.userId,
        isAdmin: user.role === "ADMIN",
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({
        user: userWithoutPassword,
        token
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful!" });
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('Google Client ID not configured');
    }

    const redirectUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      include_granted_scopes: true,
      prompt: 'consent'
    });

    res.json({ url: redirectUrl });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Failed to initialize Google authentication' });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  
  if (!code || typeof code !== 'string') {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=InvalidCode`);
  }
  
  try {
    const { tokens } = await googleClient.getToken(code as string);
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=InvalidPayload`);
    }

    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          username: payload.name || payload.email.split('@')[0],
          googleId: payload.sub,
          avatar: payload.picture || null,
          role: 'USER',
        },
      });
    }

    const token = jwt.sign(
      { id: user.userId, isAdmin: user.role === 'ADMIN' },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error('Google auth error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=GoogleAuthFailed`);
  }
};
