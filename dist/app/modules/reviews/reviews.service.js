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
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_client_1 = __importDefault(require("../../../shared/prisma-client"));
const client_1 = require("@prisma/client");
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const insertReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewExist = yield prisma_client_1.default.review.findFirst({
        where: {
            userId: payload.userId,
            bookingId: payload.userId,
        },
    });
    if (reviewExist)
        throw new api_error_1.default(http_status_1.default.CONFLICT, "Review and rating already exist!");
    const booking = yield prisma_client_1.default.booking.findUnique({
        where: {
            id: payload.bookingId,
        },
    });
    if ((booking === null || booking === void 0 ? void 0 : booking.status) !== client_1.BookingStatus.Completed)
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Review and rating only for completed booking!");
    const createdReview = yield prisma_client_1.default.review.create({
        data: payload,
    });
    return createdReview;
});
const updateReview = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewExist = yield prisma_client_1.default.review.findUnique({
        where: {
            id,
        },
    });
    if (!reviewExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Review and rating not exists");
    const review = yield prisma_client_1.default.review.update({
        where: {
            id,
        },
        data: payload,
    });
    return review;
});
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewExist = yield prisma_client_1.default.review.findUnique({
        where: {
            id,
        },
    });
    if (!reviewExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Review and rating not exists");
    yield prisma_client_1.default.review.delete({
        where: {
            id,
        },
    });
    return reviewExist;
});
const findOneReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewExist = yield prisma_client_1.default.review.findUnique({
        where: {
            id,
        },
    });
    if (!reviewExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "review and rating not exists");
    return reviewExist;
});
const findReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield prisma_client_1.default.review.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    imageUrl: true,
                },
            },
        },
    });
    return reviews;
});
exports.ReviewService = {
    insertReview,
    updateReview,
    deleteReview,
    findOneReview,
    findReviews,
};
