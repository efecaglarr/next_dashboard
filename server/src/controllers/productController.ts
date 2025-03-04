import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  userId?: string;
}

export const getProducts = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized - User ID missing" });
      return;
    }

    const search = req.query.search?.toString();
    const products = await prisma.product.findMany({
      where: {
        tenantId: req.userId,
        ...(search && {
          name: {
            contains: search,
          },
        }),
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Product retrieval error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      message: "Error retrieving products!", 
      error: errorMessage,
      userId: req.userId 
    });
  }
};

export const createProduct = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity } = req.body;
    if (!req.userId) {
      res.status(400).json({ message: "userId is missing" });
      return;
    }
    const tenantId = req.userId; // no need for non-null assertion

    const product = await prisma.product.create({
      data: { productId, name, price, rating, stockQuantity, tenantId },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product!" });
  }
};
