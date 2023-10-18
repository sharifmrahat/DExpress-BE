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
exports.BookingController = void 0;
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const response_1 = __importDefault(require("../../../shared/response"));
const bookings_service_1 = require("./bookings.service");
const insertBooking = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = req.body;
    const user = req.user;
    const result = yield bookings_service_1.BookingService.insertBooking(Object.assign(Object.assign({}, booking), { userId: user.userId }));
    return (0, response_1.default)({ message: "Booking created successfully", result }, res);
}));
const updateBookingBooking = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = req.body;
    const { id } = req.params;
    const user = req.user;
    const result = yield bookings_service_1.BookingService.updateBooking(id, booking, user);
    return (0, response_1.default)({ message: "Booking updated successfully", result }, res);
}));
const findOneBooking = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = req.user;
    const result = yield bookings_service_1.BookingService.findOneBooking(id, user);
    return (0, response_1.default)({ message: "Booking fetched successfully", result }, res);
}));
const findBookings = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const user = req.user;
    const paginationOptions = (0, pick_1.default)(query, [
        "page",
        "size",
        "sortBy",
        "sortOrder",
    ]);
    const filterOptions = (0, pick_1.default)(query, [
        "search",
        "minPrice",
        "maxPrice",
        "status",
    ]);
    const result = yield bookings_service_1.BookingService.findBookings(user, filterOptions, paginationOptions);
    return (0, response_1.default)({
        message: "Bookings retrieved successfully",
        result: { result: result.data, meta: result.meta },
    }, res);
}));
const findBookingByLorry = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const lorryId = req.params.lorryId;
    const query = req.query;
    const paginationOptions = (0, pick_1.default)(query, [
        "page",
        "size",
        "sortBy",
        "sortOrder",
    ]);
    const filterOptions = (0, pick_1.default)(query, [
        "minTotal",
        "maxTotal",
        "minRating",
        "rating",
        "status",
    ]);
    filterOptions.lorryId = lorryId;
    const result = yield bookings_service_1.BookingService.findBookings(user, filterOptions, paginationOptions);
    return (0, response_1.default)({
        message: "Booking with associated Lorrys data fetched successfully",
        result: { result: result.data, meta: result.meta },
    }, res);
}));
exports.BookingController = {
    insertBooking,
    findOneBooking,
    findBookings,
    updateBookingBooking,
    findBookingByLorry,
};
