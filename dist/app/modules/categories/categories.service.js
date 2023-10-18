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
exports.CategoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_client_1 = __importDefault(require("../../../shared/prisma-client"));
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const insertCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryExist = yield prisma_client_1.default.category.findFirst({
        where: {
            title: { equals: payload.title },
        },
    });
    if (categoryExist)
        throw new api_error_1.default(http_status_1.default.CONFLICT, "Category already exist!");
    const createdCategory = yield prisma_client_1.default.category.create({
        data: payload,
    });
    return createdCategory;
});
const updateCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryExist = yield prisma_client_1.default.category.findUnique({
        where: {
            id,
        },
    });
    if (!categoryExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Category not exists");
    const category = yield prisma_client_1.default.category.update({
        where: {
            id,
        },
        data: payload,
    });
    return category;
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryExist = yield prisma_client_1.default.category.findUnique({
        where: {
            id,
        },
        include: {
            lorries: true,
        },
    });
    if (!categoryExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Category not exists");
    yield prisma_client_1.default.category.delete({
        where: {
            id,
        },
    });
    return categoryExist;
});
const findOneCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryExist = yield prisma_client_1.default.category.findUnique({
        where: {
            id,
        },
        include: {
            lorries: {
                include: {
                    bookings: {
                        include: {
                            reviews: true,
                        },
                    },
                },
            },
        },
    });
    if (!categoryExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Category not exists");
    return categoryExist;
});
const findCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_client_1.default.category.findMany({
        include: {
            lorries: {
                include: {
                    bookings: {
                        include: {
                            reviews: true,
                        },
                    },
                },
            },
        },
    });
    return categories;
});
exports.CategoryService = {
    insertCategory,
    updateCategory,
    deleteCategory,
    findOneCategory,
    findCategories,
};
