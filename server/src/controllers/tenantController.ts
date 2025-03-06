import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

interface CustomRequest extends Request {
  userId?: string;
}

/**
 * Create a new tenant
 * This function is used during registration to create a tenant record
 */
export const createTenant = async (req: CustomRequest, res: Response) => {
  const { name, subDomain, phoneNumber, plan } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Check if user already has a tenant
    const existingTenant = await prisma.tenant.findUnique({
      where: { userId }
    });

    if (existingTenant) {
      return res.status(400).json({ message: "User already has a tenant account" });
    }

    // Check if subdomain is already taken
    const subDomainExists = await prisma.tenant.findUnique({
      where: { subDomain }
    });

    if (subDomainExists) {
      return res.status(400).json({ message: "Subdomain already in use" });
    }

    // Create the tenant
    const tenant = await prisma.tenant.create({
      data: {
        userId,
        name,
        subDomain,
        phoneNumber,
        plan
      }
    });

    // Update user role to ADMIN
    await prisma.user.update({
      where: { userId },
      data: { role: "ADMIN" }
    });

    return res.status(201).json({
      message: "Tenant created successfully",
      tenant
    });
  } catch (error) {
    console.error("Error creating tenant:", error);
    return res.status(500).json({ message: "Failed to create tenant" });
  }
};

/**
 * Get tenant details for the authenticated user
 */
export const getTenantDetails = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { userId }
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.status(200).json({ tenant });
  } catch (error) {
    console.error("Error fetching tenant details:", error);
    return res.status(500).json({ message: "Failed to fetch tenant details" });
  }
};

/**
 * Update tenant details
 */
export const updateTenant = async (req: CustomRequest, res: Response) => {
  const { name, phoneNumber, plan } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { userId }
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const updatedTenant = await prisma.tenant.update({
      where: { userId },
      data: {
        name: name || tenant.name,
        phoneNumber: phoneNumber || tenant.phoneNumber,
        plan: plan || tenant.plan
      }
    });

    return res.status(200).json({
      message: "Tenant updated successfully",
      tenant: updatedTenant
    });
  } catch (error) {
    console.error("Error updating tenant:", error);
    return res.status(500).json({ message: "Failed to update tenant" });
  }
}; 