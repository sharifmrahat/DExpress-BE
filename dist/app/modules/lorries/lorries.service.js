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
exports.LorryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const pagination_helpers_1 = __importDefault(require("../../../helpers/pagination-helpers"));
const prisma_client_1 = __importDefault(require("../../../shared/prisma-client"));
const insertLorry = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield prisma_client_1.default.lorry.findFirst({
        where: {
            plateNumber: payload.plateNumber,
        },
    });
    if (exist) {
        throw new api_error_1.default(http_status_1.default.CONFLICT, "Lorry already exist with same plate number!");
    }
    const createdLorry = yield prisma_client_1.default.lorry.create({
        data: payload,
    });
    return createdLorry;
});
const updateLorry = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const lorryExist = yield prisma_client_1.default.lorry.findUnique({
        where: {
            id,
        },
    });
    if (payload.plateNumber) {
        const exist = yield prisma_client_1.default.lorry.findMany({
            where: {
                id: { not: id },
                plateNumber: payload.plateNumber,
            },
        });
        if (exist.length)
            throw new api_error_1.default(http_status_1.default.CONFLICT, "Lorry already exist with same plate number!");
    }
    if (!lorryExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Lorry does not exists");
    const lorry = yield prisma_client_1.default.lorry.update({
        where: {
            id,
        },
        data: payload,
    });
    return lorry;
});
const deleteLorry = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const lorryExist = yield prisma_client_1.default.lorry.findUnique({
        where: {
            id,
        },
    });
    if (!lorryExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Lorry not exists");
    yield prisma_client_1.default.lorry.delete({
        where: {
            id,
        },
    });
    return lorryExist;
});
const findOneLorry = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const lorryExist = yield prisma_client_1.default.lorry.findUnique({
        where: {
            id,
        },
        include: {
            bookings: {
                include: {
                    reviews: true,
                },
            },
            category: true,
        },
    });
    if (!lorryExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Lorry not exists");
    return lorryExist;
});
const findLorries = (filterOptions, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { size, page, skip, sortBy, sortOrder } = (0, pagination_helpers_1.default)(paginationOptions);
    const andCondition = [];
    const { search } = filterOptions, options = __rest(filterOptions, ["search"]);
    if (Object.keys(options).length) {
        andCondition.push({
            AND: Object.entries(options).map(([field, value]) => {
                if (field === "minPrice") {
                    return {
                        price: {
                            gte: Number(value),
                        },
                    };
                }
                if (field === "maxPrice") {
                    return {
                        price: {
                            lte: Number(value),
                        },
                    };
                }
                return {
                    [field]: value,
                };
            }),
        });
    }
    if (search)
        andCondition.push({
            OR: ["model", "type"].map((field) => ({
                [field]: {
                    contains: search,
                    mode: "insensitive",
                },
            })),
        });
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const lorries = yield prisma_client_1.default.lorry.findMany({
        where: whereCondition,
        include: {
            bookings: {
                include: {
                    reviews: true,
                },
            },
            category: true,
        },
        skip,
        take: size,
        orderBy: sortBy && sortOrder
            ? { [sortBy]: sortOrder }
            : {
                createdAt: "desc",
            },
    });
    const count = yield prisma_client_1.default.lorry.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            size,
            total: count,
            totalPage: !isNaN(count / size) ? Math.ceil(count / size) : 0,
        },
        data: lorries,
    };
});
const findLorryByCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const lorries = yield prisma_client_1.default.lorry.findMany({
        where: {
            categoryId: id,
        },
    });
    return lorries;
});
exports.LorryService = {
    insertLorry,
    updateLorry,
    deleteLorry,
    findOneLorry,
    findLorries,
    findLorryByCategory,
};
