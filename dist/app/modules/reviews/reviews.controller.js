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
exports.ReviewController = void 0;
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const response_1 = __importDefault(require("../../../shared/response"));
const reviews_service_1 = require("./reviews.service");
const insertReview = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const review = req.body;
    const user = req.user;
    if (user)
        review.userId = user.userId;
    const result = yield reviews_service_1.ReviewService.insertReview(review);
    return (0, response_1.default)({ message: "Review And Rating inserted  successfully", result }, res);
}));
const updateReview = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = req.body;
    const user = req.user;
    if (user)
        data.userId = user.userId;
    const result = yield reviews_service_1.ReviewService.updateReview(id, data);
    return (0, response_1.default)({ message: "Review And Rating updated  successfully", result }, res);
}));
const deleteReview = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield reviews_service_1.ReviewService.deleteReview(id);
    return (0, response_1.default)({ message: "Review deleted  successfully", result }, res);
}));
const findOneReview = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield reviews_service_1.ReviewService.findOneReview(id);
    return (0, response_1.default)({ message: "Review fetched successfully", result }, res);
}));
const findReviews = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviews_service_1.ReviewService.findReviews();
    return (0, response_1.default)({ message: "Reviews retrieved successfully", result }, res);
}));
exports.ReviewController = {
    insertReview,
    updateReview,
    deleteReview,
    findOneReview,
    findReviews,
};
