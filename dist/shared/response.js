"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const responseData = (data, res) => {
    var _a, _b;
    const status = (_a = data.status) !== null && _a !== void 0 ? _a : true;
    const statusCode = (_b = data.statusCode) !== null && _b !== void 0 ? _b : http_status_1.default.OK;
    const response = Object.assign(Object.assign(Object.assign({ success: status, statusCode, data: data.result }, (data.message ? { message: data.message } : {})), (data.accessToken ? { accessToken: data.accessToken } : {})), (data.meta ? { meta: data.meta } : {}));
    return res.status(statusCode).json(response);
};
exports.default = responseData;
