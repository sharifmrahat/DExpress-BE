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
exports.FeedbackController = void 0;
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const response_1 = __importDefault(require("../../../shared/response"));
const feedbacks_service_1 = require("./feedbacks.service");
const insertFeedback = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const feedback = req.body;
    const user = req.user;
    if (user)
        feedback.userId = user.userId;
    const result = yield feedbacks_service_1.FeedbackService.insertFeedback(feedback);
    return (0, response_1.default)({ message: "Feedback inserted  successfully", result }, res);
}));
const updateFeedback = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = req.body;
    const user = req.user;
    if (user)
        data.userId = user.userId;
    const result = yield feedbacks_service_1.FeedbackService.updateFeedback(id, data);
    return (0, response_1.default)({ message: "Feedback updated  successfully", result }, res);
}));
const deleteFeedback = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield feedbacks_service_1.FeedbackService.deleteFeedback(id);
    return (0, response_1.default)({ message: "Feedback deleted  successfully", result }, res);
}));
const findOneFeedback = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield feedbacks_service_1.FeedbackService.findOneFeedback(id);
    return (0, response_1.default)({ message: "Feedback fetched successfully", result }, res);
}));
const findFeedbacks = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield feedbacks_service_1.FeedbackService.findFeedbacks();
    return (0, response_1.default)({ message: "Feedbacks retrieved successfully", result }, res);
}));
exports.FeedbackController = {
    insertFeedback,
    updateFeedback,
    deleteFeedback,
    findOneFeedback,
    findFeedbacks,
};
