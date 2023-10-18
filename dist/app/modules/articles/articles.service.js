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
exports.ArticleService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_client_1 = __importDefault(require("../../../shared/prisma-client"));
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const insertArticle = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const articleExist = yield prisma_client_1.default.article.findFirst({
        where: {
            title: { equals: payload.title },
        },
    });
    if (articleExist)
        throw new api_error_1.default(http_status_1.default.CONFLICT, "Article already exist!");
    const createdArticle = yield prisma_client_1.default.article.create({
        data: payload,
    });
    return createdArticle;
});
const updateArticle = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const articleExist = yield prisma_client_1.default.article.findUnique({
        where: {
            id,
        },
    });
    if (!articleExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Article not exists");
    const article = yield prisma_client_1.default.article.update({
        where: {
            id,
        },
        data: payload,
    });
    return article;
});
const deleteArticle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const articleExist = yield prisma_client_1.default.article.findUnique({
        where: {
            id,
        },
    });
    if (!articleExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Article not exists");
    yield prisma_client_1.default.article.delete({
        where: {
            id,
        },
    });
    return articleExist;
});
const findOneArticle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const articleExist = yield prisma_client_1.default.article.findUnique({
        where: {
            id,
        },
    });
    if (!articleExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Article not exists");
    return articleExist;
});
const findArticles = () => __awaiter(void 0, void 0, void 0, function* () {
    const articles = yield prisma_client_1.default.article.findMany({});
    return articles;
});
exports.ArticleService = {
    insertArticle,
    updateArticle,
    deleteArticle,
    findOneArticle,
    findArticles,
};
