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
exports.LorryController = void 0;
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const response_1 = __importDefault(require("../../../shared/response"));
const lorries_service_1 = require("./lorries.service");
const insertLorry = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lorry = req.body;
    const result = yield lorries_service_1.LorryService.insertLorry(lorry);
    return (0, response_1.default)({ message: "Lorry inserted  successfully", result }, res);
}));
const updateLorry = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = req.body;
    const result = yield lorries_service_1.LorryService.updateLorry(id, data);
    return (0, response_1.default)({ message: "Lorry updated  successfully", result }, res);
}));
const deleteLorry = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield lorries_service_1.LorryService.deleteLorry(id);
    return (0, response_1.default)({ message: "Lorry deleted  successfully", result }, res);
}));
const findOneLorry = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield lorries_service_1.LorryService.findOneLorry(id);
    return (0, response_1.default)({ message: "Lorry fetched successfully", result }, res);
}));
const findLorries = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const paginationOptions = (0, pick_1.default)(query, [
        "page",
        "size",
        "sortBy",
        "sortOrder",
    ]);
    const filterOptions = (0, pick_1.default)(query, [
        "search",
        "minPrice",
        "maxPrice",
        "status",
    ]);
    const result = yield lorries_service_1.LorryService.findLorries(filterOptions, paginationOptions);
    return (0, response_1.default)({
        message: "Lorries retrieved successfully",
        result: { result: result.data, meta: result.meta },
    }, res);
}));
const findLorryByCategory = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.categoryId;
    const query = req.query;
    const paginationOptions = (0, pick_1.default)(query, [
        "page",
        "size",
        "sortBy",
        "sortOrder",
    ]);
    const filterOptions = (0, pick_1.default)(query, [
        "search",
        "minPrice",
        "maxPrice",
        "status",
    ]);
    filterOptions.categoryId = categoryId;
    const result = yield lorries_service_1.LorryService.findLorries(filterOptions, paginationOptions);
    return (0, response_1.default)({
        message: "Lorries with associated category data fetched successfully",
        result: { result: result.data, meta: result.meta },
    }, res);
}));
exports.LorryController = {
    insertLorry,
    updateLorry,
    deleteLorry,
    findOneLorry,
    findLorries,
    findLorryByCategory,
};
