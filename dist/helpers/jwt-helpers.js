"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtHelpers = void 0;
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (data) => {
    var token = jsonwebtoken_1.default.sign(data, config_1.default.JWT_SECRET_ACCESS, { expiresIn: config_1.default.JWT_SECRET_EXPIRY });
    return token;
};
const verifyToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET_ACCESS);
    return decoded;
};
exports.JwtHelpers = {
    generateToken,
    verifyToken
};
