import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  userId?: string;
}

export const createEmployee = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId, name, phoneNumber } = req.body;
    
    if (!req.userId) {
      res.status(400).json({ message: "Authentication required" });
      return;
    }
    
    // Find the tenant associated with the authenticated user
    const tenant = await prisma.tenant.findUnique({
      where: { userId: req.userId }
    });
    
    if (!tenant) {
      res.status(403).json({ message: "Only tenants can create employees" });
      return;
    }
    
    // Update the user's role to EMPLOYEE
    await prisma.user.update({
      where: { userId },
      data: { role: "EMPLOYEE" }
    });
    
    // Create the employee record
    const employee = await prisma.employee.create({
      data: {
        userId,
        tenantId: tenant.tenantId,
        name,
        phoneNumber
      }
    });
    
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error creating employee!" });
  }
};
