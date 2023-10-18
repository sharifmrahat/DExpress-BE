"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackRouter = void 0;
const express_1 = __importDefault(require("express"));
const feedbacks_controller_1 = require("./feedbacks.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const feedbacks_validation_1 = require("./feedbacks.validation");
const validate_request_1 = __importDefault(require("../../middlewares/validate-request"));
const router = express_1.default.Router();
router
    .route("/create-feedback")
    .post((0, validate_request_1.default)(feedbacks_validation_1.FeedbackValidation.createFeedbackZodSchema), (0, auth_1.default)(client_1.Role.customer, "public"), feedbacks_controller_1.FeedbackController.insertFeedback);
router.route("/").get(feedbacks_controller_1.FeedbackController.findFeedbacks);
router
    .route("/:id")
    .get(feedbacks_controller_1.FeedbackController.findOneFeedback)
    .patch((0, validate_request_1.default)(feedbacks_validation_1.FeedbackValidation.updateFeedbackZodSchema), (0, auth_1.default)(client_1.Role.customer, client_1.Role.admin, client_1.Role.super_admin), feedbacks_controller_1.FeedbackController.updateFeedback)
    .delete((0, auth_1.default)(client_1.Role.admin, client_1.Role.super_admin), feedbacks_controller_1.FeedbackController.deleteFeedback);
exports.FeedbackRouter = router;
