"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const handle_validation_error_1 = __importDefault(require("../../errors/handle-validation-error"));
const handle_client_error_1 = __importDefault(require("../../errors/handle-client-error"));
const api_error_1 = __importDefault(require("../../errors/api-error"));
const zod_1 = require("zod");
const handle_zod_error_1 = __importDefault(require("../../errors/handle-zod-error"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong !';
    let errorMessages = [];
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        const simplifiedError = (0, handle_validation_error_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = (0, handle_client_error_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handle_zod_error_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof api_error_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    else if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    return res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: error === null || error === void 0 ? void 0 : error.stack
    });
};
exports.default = globalErrorHandler;
