"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_request_1 = __importDefault(require("../../middlewares/validate-request"));
const bookings_controller_1 = require("./bookings.controller");
const bookings_validation_1 = require("./bookings.validation");
const router = express_1.default.Router();
router
    .route("/create-booking")
    .post((0, validate_request_1.default)(bookings_validation_1.BookingValidation.createBookingZodSchema), (0, auth_1.default)(client_1.Role.customer), bookings_controller_1.BookingController.insertBooking);
router
    .route("/")
    .get((0, auth_1.default)(client_1.Role.super_admin, client_1.Role.admin, client_1.Role.customer), bookings_controller_1.BookingController.findBookings);
router
    .route("/:lorryId/lorry")
    .get((0, auth_1.default)(client_1.Role.super_admin, client_1.Role.admin), bookings_controller_1.BookingController.findBookingByLorry);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.Role.super_admin, client_1.Role.admin, client_1.Role.customer), bookings_controller_1.BookingController.findOneBooking)
    .patch((0, validate_request_1.default)(bookings_validation_1.BookingValidation.updateBookingZodSchema), (0, auth_1.default)(client_1.Role.admin, client_1.Role.super_admin, client_1.Role.customer), bookings_controller_1.BookingController.updateBookingBooking);
exports.BookingRouter = router;
