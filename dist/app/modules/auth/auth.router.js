"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const validate_request_1 = __importDefault(require("../../middlewares/validate-request"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router
    .route("/signup")
    .post((0, validate_request_1.default)(auth_validation_1.AuthValidation.signupAuthZodSchema), auth_controller_1.AuthController.signup);
router
    .route("/login")
    .post((0, validate_request_1.default)(auth_validation_1.AuthValidation.loginAuthZodSchema), auth_controller_1.AuthController.login);
exports.AuthRouter = router;
