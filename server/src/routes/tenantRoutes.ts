import express, { Router } from "express";
import {
  createTenant,
  getTenantDetails,
  updateTenant
} from "../controllers/tenantController";
import { verifyToken } from "../middleware/verifyToken";

const router: Router = express.Router();

// All tenant routes require authentication
router.use(verifyToken as any);

// Tenant management routes
router.post("/create", createTenant as any);
router.get("/details", getTenantDetails as any);
router.put("/update", updateTenant as any);

export default router; 