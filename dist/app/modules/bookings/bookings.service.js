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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const pagination_helpers_1 = __importDefault(require("../../../helpers/pagination-helpers"));
const prisma_client_1 = __importDefault(require("../../../shared/prisma-client"));
const bookings_utils_1 = require("./bookings.utils");
const insertBooking = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_client_1.default.$transaction((trxClient) => __awaiter(void 0, void 0, void 0, function* () {
        const existBooking = yield trxClient.booking.findMany({
            where: {
                lorryId: payload.lorryId,
                status: {
                    in: [client_1.BookingStatus.Pending, client_1.BookingStatus.Booked],
                },
            },
        });
        if (existBooking.length)
            throw new api_error_1.default(http_status_1.default.CONFLICT, "This lorry already booked");
        if (!payload.status)
            payload.status = client_1.BookingStatus.Pending;
        const total = yield bookings_utils_1.BookingUtils.calculateTotal(payload.startTime, payload.endTime, payload.lorryId);
        const createdBooking = yield trxClient.booking.create({
            data: Object.assign(Object.assign({}, payload), { total }),
        });
        if (!createdBooking)
            throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "booking has failed!");
        yield trxClient.lorry.update({
            where: {
                id: createdBooking.lorryId,
            },
            data: {
                status: client_1.LorryStatus.Booked,
            },
        });
        return createdBooking;
    }));
});
const updateBooking = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_client_1.default.$transaction((trxClient) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const exist = yield trxClient.booking.findUnique({
            where: {
                id,
            },
        });
        if (user.role === client_1.Role.customer && (exist === null || exist === void 0 ? void 0 : exist.userId) !== user.userId) {
            throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
        }
        if (!exist)
            throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Booking not found!");
        if (payload.status) {
            if ((exist.status === client_1.BookingStatus.Pending &&
                !(client_1.BookingStatus.Booked === payload.status ||
                    client_1.BookingStatus.Rejected === payload.status ||
                    client_1.BookingStatus.Cancelled === payload.status)) ||
                (exist.status === client_1.BookingStatus.Booked &&
                    !(client_1.BookingStatus.Cancelled === payload.status ||
                        client_1.BookingStatus.Completed === payload.status)) ||
                exist.status === client_1.BookingStatus.Cancelled ||
                exist.status === client_1.BookingStatus.Rejected ||
                exist.status === client_1.BookingStatus.Completed) {
                throw new api_error_1.default(http_status_1.default.NOT_ACCEPTABLE, "Invalid status can not proceed");
            }
            if (payload.status && exist.status !== payload.status) {
                if (!(payload.status === client_1.BookingStatus.Pending ||
                    payload.status === client_1.BookingStatus.Cancelled)) {
                    if (user.role === client_1.Role.customer)
                        throw new api_error_1.default(http_status_1.default.NOT_ACCEPTABLE, "Only Admin can update");
                }
                else {
                    if (user.role !== client_1.Role.customer)
                        throw new api_error_1.default(http_status_1.default.NOT_ACCEPTABLE, "Only Customer can update");
                }
            }
            const existBooking = yield trxClient.booking.findMany({
                where: {
                    lorryId: (_a = payload.lorryId) !== null && _a !== void 0 ? _a : exist.lorryId,
                    status: {
                        in: [client_1.BookingStatus.Pending, client_1.BookingStatus.Booked],
                    },
                    id: {
                        not: id,
                    },
                },
            });
            if (existBooking.length)
                throw new api_error_1.default(http_status_1.default.CONFLICT, "This lorry is already booked");
        }
        const total = yield bookings_utils_1.BookingUtils.calculateTotal((_b = payload.startTime) !== null && _b !== void 0 ? _b : exist.startTime, (_c = payload.endTime) !== null && _c !== void 0 ? _c : exist.endTime, (_d = payload.lorryId) !== null && _d !== void 0 ? _d : exist.lorryId);
        const updatedBooking = yield trxClient.booking.update({
            where: {
                id,
            },
            data: Object.assign(Object.assign({}, payload), { total }),
        });
        if (exist.status !== updatedBooking.status &&
            (updatedBooking.status === client_1.BookingStatus.Cancelled ||
                updatedBooking.status === client_1.BookingStatus.Completed ||
                updatedBooking.status === client_1.BookingStatus.Rejected))
            yield trxClient.lorry.update({
                where: {
                    id: updatedBooking.lorryId,
                },
                data: {
                    status: client_1.LorryStatus.Available,
                },
            });
        return updatedBooking;
    }));
});
const findOneBooking = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingExist = yield prisma_client_1.default.booking.findUnique({
        where: {
            id,
        },
    });
    if (!bookingExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Booking does not exist!");
    if (payload.role === client_1.Role.admin)
        return bookingExist;
    if (payload.role === client_1.Role.customer &&
        payload.userId !== (bookingExist === null || bookingExist === void 0 ? void 0 : bookingExist.userId)) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Forbidden Access!");
    }
    return bookingExist;
});
const findBookings = (payload, filterOptions, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { size, page, skip, sortBy, sortOrder } = (0, pagination_helpers_1.default)(paginationOptions);
    const andCondition = [];
    const { search } = filterOptions, options = __rest(filterOptions, ["search"]);
    if (Object.keys(options).length) {
        andCondition.push({
            AND: Object.entries(options).map(([field, value]) => {
                if (field === "minTotal") {
                    return {
                        total: {
                            gte: Number(value),
                        },
                    };
                }
                if (field === "maxTotal") {
                    return {
                        total: {
                            lte: Number(value),
                        },
                    };
                }
                if (field === "minRating") {
                    return {
                        reviewAndRatings: {
                            rating: {
                                gte: Number(value),
                            },
                        },
                    };
                }
                if (field === "rating") {
                    return {
                        reviewAndRatings: {
                            rating: Number(value),
                        },
                    };
                }
                if (payload.role === client_1.Role.customer) {
                    return {
                        userId: payload.userId,
                    };
                }
                return {
                    [field]: value,
                };
            }),
        });
    }
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const bookings = yield prisma_client_1.default.booking.findMany({
        where: whereCondition,
        include: {
            lorry: true,
            user: true,
            reviews: true,
        },
        skip,
        take: size,
        orderBy: sortBy && sortOrder
            ? { [sortBy]: sortOrder }
            : {
                createdAt: "desc",
            },
    });
    const count = yield prisma_client_1.default.booking.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            size,
            total: count,
            totalPage: !isNaN(count / size) ? Math.ceil(count / size) : 0,
        },
        data: bookings,
    };
});
exports.BookingService = {
    insertBooking,
    findOneBooking,
    findBookings,
    updateBooking,
};
