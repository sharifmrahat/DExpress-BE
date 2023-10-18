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
exports.CategoryController = void 0;
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const response_1 = __importDefault(require("../../../shared/response"));
const categories_service_1 = require("./categories.service");
const insertCategory = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.body;
    const result = yield categories_service_1.CategoryService.insertCategory(category);
    return (0, response_1.default)({ message: "Category inserted  successfully", result }, res);
}));
const updateCategory = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = req.body;
    const result = yield categories_service_1.CategoryService.updateCategory(id, data);
    return (0, response_1.default)({ message: "Category updated  successfully", result }, res);
}));
const deleteCategory = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield categories_service_1.CategoryService.deleteCategory(id);
    return (0, response_1.default)({ message: "Category deleted  successfully", result }, res);
}));
const findOneCategory = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield categories_service_1.CategoryService.findOneCategory(id);
    return (0, response_1.default)({ message: "Category fetched successfully", result }, res);
}));
const findCategories = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categories_service_1.CategoryService.findCategories();
    return (0, response_1.default)({ message: "Categories retrieved successfully", result }, res);
}));
exports.CategoryController = {
    insertCategory,
    updateCategory,
    deleteCategory,
    findOneCategory,
    findCategories,
};
