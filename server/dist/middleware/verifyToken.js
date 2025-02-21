"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({ message: "Not Authenticated!" });
    if (!process.env.JWT_SECRET_KEY) {
        return res
            .status(500)
            .json({ message: "Server error: Missing JWT secret." });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json({ message: "Not Valid Token!" });
        req.userId = payload.id;
        next();
    }));
};
exports.verifyToken = verifyToken;
const requireAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "Not Authenticated!" });
    }
    if (!process.env.JWT_SECRET_KEY) {
        return res
            .status(500)
            .json({ message: "Server error: Missing JWT secret." });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) {
            console.log("Invalid token:", err.message);
            return res.status(403).json({ message: "Not Valid Token!" });
        }
        if (!payload.isAdmin) {
            console.log("User is not an admin:", payload);
            return res.status(403).json({ message: "Not Authorized!" });
        }
        req.userId = payload.id;
        next();
    });
};
exports.requireAdmin = requireAdmin;
