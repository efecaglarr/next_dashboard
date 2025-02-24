"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.post("/register", authController_1.register);
router.post("/createAdmin", verifyToken_1.requireAdmin, authController_1.createAdmin);
router.post("/login", authController_1.login);
router.post("/logout", authController_1.logout);
router.get('/google', authController_1.googleAuth);
router.get('/google/callback', authController_1.googleCallback);
exports.default = router;
