"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LorryRouter = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const lorries_controller_1 = require("./lorries.controller");
const validate_request_1 = __importDefault(require("../../middlewares/validate-request"));
const lorries_validation_1 = require("./lorries.validation");
const router = express_1.default.Router();
router
    .route("/create-lorry")
    .post((0, validate_request_1.default)(lorries_validation_1.LorryValidation.createLorryZodSchema), (0, auth_1.default)(client_1.Role.admin), lorries_controller_1.LorryController.insertLorry);
router.route("/").get(lorries_controller_1.LorryController.findLorries);
router.route("/:categoryId/category").get(lorries_controller_1.LorryController.findLorryByCategory);
router
    .route("/:id")
    .get(lorries_controller_1.LorryController.findOneLorry)
    .patch((0, validate_request_1.default)(lorries_validation_1.LorryValidation.updateLorryZodSchema), (0, auth_1.default)(client_1.Role.admin), lorries_controller_1.LorryController.updateLorry)
    .delete((0, auth_1.default)(client_1.Role.admin), lorries_controller_1.LorryController.deleteLorry);
exports.LorryRouter = router;
