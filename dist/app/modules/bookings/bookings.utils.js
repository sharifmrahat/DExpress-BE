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
exports.BookingUtils = exports.calculateTotal = void 0;
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const prisma_client_1 = __importDefault(require("../../../shared/prisma-client"));
const client_1 = require("@prisma/client");
const calculateTotal = (startDate, endDate, lorryId) => __awaiter(void 0, void 0, void 0, function* () {
    const lorry = yield prisma_client_1.default.lorry.findUnique({
        where: {
            id: lorryId,
            status: {
                not: client_1.LorryStatus.Available,
            },
        },
    });
    if (!lorry)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Lorry Does not found!");
    const startOfTheDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
    const endOfTheDate = new Date(new Date(endDate).setHours(0, 0, 0, 0));
    const timeDifference = endOfTheDate.getTime() - startOfTheDate.getTime();
    if (timeDifference < 0)
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Invalid Date selection!");
    var daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    const total = lorry.price * daysDifference;
    return total;
});
exports.calculateTotal = calculateTotal;
exports.BookingUtils = {
    calculateTotal: exports.calculateTotal,
};
