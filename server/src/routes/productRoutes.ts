import { Router } from "express";
import { createProduct, getProducts } from "../controllers/productController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get("/", verifyToken, getProducts);
router.post("/post", verifyToken, createProduct);

export default router;
 