import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  userId?: string;
}

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.product.findMany({
      // if i have query it'll search for it if i don't it'll give all the products
      where: {
        name: {
          contains: search,
        },
      },
    });

    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products!" });
  }
};

export const createProduct = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity } = req.body;
    if (!req.userId) {
      res.status(400).json({ message: "tenantId is missing" });
      return; 
    }
    const tenantId = req.userId; // no need for non-null assertion


    const product = await prisma.product.create({
      data: { productId, name, price, rating, stockQuantity, tenantId },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating product!" });
  }
};
