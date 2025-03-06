import express, { Router } from "express";
import {
  getAllUsers,
  getDashboardStats,
  updateUserRole,
  updateUserStatus,
  createUser,
  getAllTenants,
  updateTenantPlan,
  getAllProducts,
  getProductsByTenant
} from "../controllers/adminController";
import { verifyToken, requireAdmin } from "../middleware/verifyToken";

const router: Router = express.Router();

// All admin routes require authentication and admin privileges
router.use(verifyToken as any);
router.use(requireAdmin as any);

// User management
router.get("/users", getAllUsers as any);
router.put("/users/:userId/role", updateUserRole as any);
router.put("/users/:userId/status", updateUserStatus as any);
router.post("/users", createUser as any);

// Tenant management
router.get("/tenants", getAllTenants as any);
router.put("/tenants/:tenantId/plan", updateTenantPlan as any);

// Product management
router.get("/products", getAllProducts as any);
router.get("/tenants/:tenantId/products", getProductsByTenant as any);

// Dashboard
router.get("/dashboard", getDashboardStats as any);

export default router; 