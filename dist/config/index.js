"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS),
    JWT_SECRET_ACCESS: process.env.JWT_SECRET_ACCESS,
    JWT_SECRET_EXPIRY: process.env.JWT_SECRET_EXPIRY,
    DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
};
