"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleRouter = void 0;
const express_1 = __importDefault(require("express"));
const articles_controller_1 = require("./articles.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const articels_validation_1 = require("./articels.validation");
const validate_request_1 = __importDefault(require("../../middlewares/validate-request"));
const router = express_1.default.Router();
router
    .route("/create-article")
    .post((0, validate_request_1.default)(articels_validation_1.ArticleValidation.createArticleZodSchema), (0, auth_1.default)(client_1.Role.admin, client_1.Role.super_admin), articles_controller_1.ArticleController.insertArticle);
router.route("/").get(articles_controller_1.ArticleController.findArticles);
router
    .route("/:id")
    .get(articles_controller_1.ArticleController.findOneArticle)
    .patch((0, validate_request_1.default)(articels_validation_1.ArticleValidation.updateArticleZodSchema), (0, auth_1.default)(client_1.Role.admin, client_1.Role.super_admin), articles_controller_1.ArticleController.updateArticle)
    .delete((0, auth_1.default)(client_1.Role.admin, client_1.Role.super_admin), articles_controller_1.ArticleController.deleteArticle);
exports.ArticleRouter = router;
