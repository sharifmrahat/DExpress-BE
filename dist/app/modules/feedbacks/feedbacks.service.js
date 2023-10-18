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
exports.FeedbackService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_client_1 = __importDefault(require("../../../shared/prisma-client"));
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const insertFeedback = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbackExist = yield prisma_client_1.default.feedback.findFirst({
        where: {
            topic: { equals: payload.topic },
        },
    });
    if (feedbackExist)
        throw new api_error_1.default(http_status_1.default.CONFLICT, "Feedback is already exist!");
    const createdFeedback = yield prisma_client_1.default.feedback.create({
        data: payload,
    });
    return createdFeedback;
});
const updateFeedback = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbackExist = yield prisma_client_1.default.feedback.findUnique({
        where: {
            id,
        },
    });
    if (!feedbackExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Feedback does not exists");
    const feedback = yield prisma_client_1.default.feedback.update({
        where: {
            id,
        },
        data: payload,
    });
    return feedback;
});
const deleteFeedback = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbackExist = yield prisma_client_1.default.feedback.findUnique({
        where: {
            id,
        },
    });
    if (!feedbackExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Feedback does not exists");
    yield prisma_client_1.default.feedback.delete({
        where: {
            id,
        },
    });
    return feedbackExist;
});
const findOneFeedback = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbackExist = yield prisma_client_1.default.feedback.findUnique({
        where: {
            id,
        },
    });
    if (!feedbackExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Feedback does not exists");
    return feedbackExist;
});
const findFeedbacks = () => __awaiter(void 0, void 0, void 0, function* () {
    const feedbacks = yield prisma_client_1.default.feedback.findMany({});
    return feedbacks;
});
exports.FeedbackService = {
    insertFeedback,
    updateFeedback,
    deleteFeedback,
    findOneFeedback,
    findFeedbacks,
};
