"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validate_request_1 = __importDefault(require("../../middlewares/validate-request"));
const users_validation_1 = require("./users.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(client_1.Role.admin, client_1.Role.super_admin), users_controller_1.UserController.findUsers);
router
    .route("/profile")
    .get((0, auth_1.default)(client_1.Role.customer, client_1.Role.admin, client_1.Role.super_admin), users_controller_1.UserController.userProfile);
router
    .route("/create-admin")
    .post((0, auth_1.default)(client_1.Role.admin, client_1.Role.super_admin), (0, validate_request_1.default)(users_validation_1.UserValidation.createUserValidation), users_controller_1.UserController.insertUser);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.Role.admin, client_1.Role.super_admin), users_controller_1.UserController.findOneUser)
    .patch((0, validate_request_1.default)(users_validation_1.UserValidation.updateUserValidation), (0, auth_1.default)(client_1.Role.admin, client_1.Role.super_admin, client_1.Role.customer), users_controller_1.UserController.updateUser)
    .delete((0, auth_1.default)(client_1.Role.admin, client_1.Role.super_admin), users_controller_1.UserController.deleteUser);
exports.UserRouter = router;
