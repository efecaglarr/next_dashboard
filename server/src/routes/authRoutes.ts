import express, { Router } from "express";
import {
  createAdmin,
  login,
  logout,
  register,
  googleAuth,
  googleCallback,
  deleteUser,
} from "../controllers/authController";
import { requireAdmin } from "../middleware/verifyToken";

const router: Router = express.Router();

router.post("/register", register as express.RequestHandler);
router.post("/login", login as express.RequestHandler);
router.post("/logout", logout as express.RequestHandler);
router.post(
  "/createAdmin",
  requireAdmin as express.RequestHandler,
  createAdmin as express.RequestHandler
);
router.post("/delete", 
  requireAdmin as express.RequestHandler,
  deleteUser as express.RequestHandler);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

export default router;  
