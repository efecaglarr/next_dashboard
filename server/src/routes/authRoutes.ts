import express, { Router } from "express";
import {
  createAdmin,
  login,
  logout,
  register,
} from "../controllers/authController";
import { requireAdmin } from "../middleware/verifyToken";

const router: Router = express.Router();

router.post("/register", register as express.RequestHandler);
router.post(
  "/createAdmin",
  requireAdmin as express.RequestHandler,
  createAdmin as express.RequestHandler
);
router.post("/login", login as express.RequestHandler);
router.post("/logout", logout as express.RequestHandler);

export default router;  
