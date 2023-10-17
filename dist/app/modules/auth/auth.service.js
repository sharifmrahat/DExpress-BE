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
exports.AuthService = void 0;
const prisma_client_1 = __importDefault(require("../../../shared/prisma-client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const http_status_1 = __importDefault(require("http-status"));
const jwt_helpers_1 = require("../../../helpers/jwt-helpers");
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield prisma_client_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!userExist)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User does not exist!");
    if ((userExist === null || userExist === void 0 ? void 0 : userExist.password) &&
        !(yield bcrypt_1.default.compare(payload.password, userExist === null || userExist === void 0 ? void 0 : userExist.password)))
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Email or Password not matched!");
    const accessToken = jwt_helpers_1.JwtHelpers.generateToken({
        userId: userExist === null || userExist === void 0 ? void 0 : userExist.id,
        name: userExist.name,
        email: userExist.email,
        role: userExist === null || userExist === void 0 ? void 0 : userExist.role,
    });
    return accessToken;
});
const signup = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const password = payload.password;
    payload.password = yield bcrypt_1.default.hash(password, config_1.default.BCRYPT_SALT_ROUNDS);
    const createdUser = yield prisma_client_1.default.user.create({
        data: payload,
    });
    if (!createdUser)
        throw new api_error_1.default(http_status_1.default.EXPECTATION_FAILED, "User created failed");
    const user = yield prisma_client_1.default.user.findFirst({
        where: {
            id: createdUser.id,
        },
    });
    user === null || user === void 0 ? true : delete user.password;
    return user;
});
exports.AuthService = {
    signup,
    login,
};
