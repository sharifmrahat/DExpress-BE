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
exports.ArticleController = void 0;
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const response_1 = __importDefault(require("../../../shared/response"));
const articles_service_1 = require("./articles.service");
const insertArticle = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const article = req.body;
    const result = yield articles_service_1.ArticleService.insertArticle(article);
    return (0, response_1.default)({ message: "Article inserted  successfully", result }, res);
}));
const updateArticle = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = req.body;
    const result = yield articles_service_1.ArticleService.updateArticle(id, data);
    return (0, response_1.default)({ message: "Article updated  successfully", result }, res);
}));
const deleteArticle = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield articles_service_1.ArticleService.deleteArticle(id);
    return (0, response_1.default)({ message: "Article deleted  successfully", result }, res);
}));
const findOneArticle = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield articles_service_1.ArticleService.findOneArticle(id);
    return (0, response_1.default)({ message: "Article fetched successfully", result }, res);
}));
const findArticles = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield articles_service_1.ArticleService.findArticles();
    return (0, response_1.default)({ message: "Articles retrieved successfully", result }, res);
}));
exports.ArticleController = {
    insertArticle,
    updateArticle,
    deleteArticle,
    findOneArticle,
    findArticles,
};
