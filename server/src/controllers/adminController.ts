import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

interface CustomRequest extends Request {
  userId?: string;
}

/**
 * Get all users
 */
export const getAllUsers = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { userId: req.userId }
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await prisma.user.findMany({
      select: {
        userId: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
        phoneNumber: true,
        googleId: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { userId: req.userId }
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Get counts
    const totalUsers = await prisma.user.count();
    const totalTenants = await prisma.tenant.count();
    const totalProducts = await prisma.product.count();
    const totalEmployees = await prisma.employee.count();

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      select: {
        userId: true,
        username: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    return res.status(200).json({
      totalUsers,
      totalTenants,
      totalProducts,
      totalEmployees,
      recentUsers
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (req: CustomRequest, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { userId: req.userId }
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Validate role
    if (!["USER", "ADMIN", "EMPLOYEE"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { role },
      select: {
        userId: true,
        username: true,
        email: true,
        role: true,
        status: true,
      }
    });

    return res.status(200).json({
      message: "User role updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Failed to update user role" });
  }
};

/**
 * Update user status
 */
export const updateUserStatus = async (req: CustomRequest, res: Response) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { userId: req.userId }
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Validate status
    if (!["ACTIVE", "INACTIVE", "SUSPENDED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { status },
      select: {
        userId: true,
        username: true,
        email: true,
        role: true,
        status: true,
      }
    });

    return res.status(200).json({
      message: "User status updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({ message: "Failed to update user status" });
  }
};

/**
 * Create a new user (admin only)
 */
export const createUser = async (req: CustomRequest, res: Response) => {
  const { username, email, password, role, status } = req.body;

  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { userId: req.userId }
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email or username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || "USER",
        status: status || "ACTIVE",
      },
      select: {
        userId: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      }
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Failed to create user" });
  }
};

/**
 * Get all tenants
 */
export const getAllTenants = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { userId: req.userId }
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const tenants = await prisma.tenant.findMany({
      select: {
        tenantId: true,
        name: true,
        subDomain: true,
        plan: true,
        phoneNumber: true,
        user: {
          select: {
            userId: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    // Transform the data to include createdAt and updatedAt from the user
    const formattedTenants = tenants.map(tenant => ({
      tenantId: tenant.tenantId,
      name: tenant.name,
      subDomain: tenant.subDomain,
      plan: tenant.plan,
      phoneNumber: tenant.phoneNumber,
      createdAt: tenant.user.createdAt,
      updatedAt: tenant.user.updatedAt,
      user: {
        userId: tenant.user.userId,
        username: tenant.user.username,
        email: tenant.user.email
      }
    }));

    return res.status(200).json({ tenants: formattedTenants });
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return res.status(500).json({ message: "Failed to fetch tenants" });
  }
};

/**
 * Update tenant plan
 */
export const updateTenantPlan = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { userId: req.userId }
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { tenantId } = req.params;
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({ message: "Plan is required" });
    }

    // Check if tenant exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { tenantId }
    });

    if (!existingTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Update tenant plan
    const updatedTenant = await prisma.tenant.update({
      where: { tenantId },
      data: { plan },
      select: {
        tenantId: true,
        name: true,
        subDomain: true,
        plan: true,
        phoneNumber: true,
        user: {
          select: {
            userId: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    // Format the response to match the expected interface
    const formattedTenant = {
      tenantId: updatedTenant.tenantId,
      name: updatedTenant.name,
      subDomain: updatedTenant.subDomain,
      plan: updatedTenant.plan,
      phoneNumber: updatedTenant.phoneNumber,
      createdAt: updatedTenant.user.createdAt,
      updatedAt: updatedTenant.user.updatedAt,
      user: {
        userId: updatedTenant.user.userId,
        username: updatedTenant.user.username,
        email: updatedTenant.user.email
      }
    };

    return res.status(200).json({ 
      tenant: formattedTenant, 
      message: "Tenant plan updated successfully" 
    });
  } catch (error) {
    console.error("Error updating tenant plan:", error);
    return res.status(500).json({ message: "Failed to update tenant plan" });
  }
};

/**
 * Get all products
 */
export const getAllProducts = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { userId: req.userId }
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const products = await prisma.product.findMany({
      select: {
        productId: true,
        name: true,
        price: true,
        stockQuantity: true,
        rating: true,
        tenant: {
          select: {
            tenantId: true,
            name: true
          }
        }
      }
    });

    // Transform the data to match your expected interface
    const formattedProducts = products.map(product => ({
      productId: product.productId,
      name: product.name,
      description: "Product description", // Add a default description since it's not in the schema
      price: product.price,
      stock: product.stockQuantity, // Map stockQuantity to stock
      category: "General", // Add a default category since it's not in the schema
      createdAt: new Date().toISOString(), // Add a default createdAt
      tenant: product.tenant
    }));

    return res.status(200).json({ products: formattedProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};

/**
 * Get products by tenant
 */
export const getProductsByTenant = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { userId: req.userId }
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { tenantId } = req.params;

    const products = await prisma.product.findMany({
      where: {
        tenantId
      },
      select: {
        productId: true,
        name: true,
        price: true,
        stockQuantity: true,
        rating: true,
        tenant: {
          select: {
            tenantId: true,
            name: true
          }
        }
      }
    });

    // Transform the data to match your expected interface
    const formattedProducts = products.map(product => ({
      productId: product.productId,
      name: product.name,
      description: "Product description", // Add a default description since it's not in the schema
      price: product.price,
      stock: product.stockQuantity, // Map stockQuantity to stock
      category: "General", // Add a default category since it's not in the schema
      createdAt: new Date().toISOString(), // Add a default createdAt
      tenant: product.tenant
    }));

    return res.status(200).json({ products: formattedProducts });
  } catch (error) {
    console.error("Error fetching products by tenant:", error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
}; 