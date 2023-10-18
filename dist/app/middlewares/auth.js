"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../errors/api-error"));
const jwt_helpers_1 = require("../../helpers/jwt-helpers");
const auth = (...roles) => {
    return (req, res, next) => {
        try {
            let isPublic = false;
            if (roles.includes('public'))
                isPublic = true;
            const { authorization } = req.headers;
            if (!authorization && !isPublic) {
                throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Invalid token!");
            }
            let token = authorization;
            let user = null;
            try {
                if (authorization)
                    user = jwt_helpers_1.JwtHelpers.verifyToken(token);
            }
            catch (err) {
                throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Forbidden!");
            }
            if (!user && !isPublic)
                throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Forbidden!");
            req.user = user;
            if ((roles === null || roles === void 0 ? void 0 : roles.length) && !isPublic) {
                if (user && (!user.role || !roles.includes(user.role))) {
                    throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Forbidden!");
                }
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = auth;
