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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const products = yield prisma.product.findMany({
            // if i have query it'll search for it if i don't it'll give all the products
            where: {
                name: {
                    contains: search,
                },
            },
        });
        res.status(201).json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving products!" });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, name, price, rating, stockQuantity } = req.body;
        if (!req.userId) {
            res.status(400).json({ message: "tenantId is missing" });
            return;
        }
        const tenantId = req.userId; // no need for non-null assertion
        const product = yield prisma.product.create({
            data: { productId, name, price, rating, stockQuantity, tenantId },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating product!" });
    }
});
exports.createProduct = createProduct;
