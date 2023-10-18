"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRouter = void 0;
const express_1 = __importDefault(require("express"));
const reviews_controller_1 = require("./reviews.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const reviews_validation_1 = require("./reviews.validation");
const validate_request_1 = __importDefault(require("../../middlewares/validate-request"));
const router = express_1.default.Router();
router
    .route("/create-review")
    .post((0, validate_request_1.default)(reviews_validation_1.ReviewValidation.createReviewZodSchema), (0, auth_1.default)(client_1.Role.customer), reviews_controller_1.ReviewController.insertReview);
router.route("/").get(reviews_controller_1.ReviewController.findReviews);
router
    .route("/:id")
    .get(reviews_controller_1.ReviewController.findOneReview)
    .patch((0, validate_request_1.default)(reviews_validation_1.ReviewValidation.updateReviewZodSchema), (0, auth_1.default)(client_1.Role.customer), reviews_controller_1.ReviewController.updateReview)
    .delete((0, auth_1.default)(client_1.Role.customer), reviews_controller_1.ReviewController.deleteReview);
exports.ReviewRouter = router;
