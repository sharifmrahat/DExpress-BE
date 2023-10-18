"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const global_error_1 = __importDefault(require("./app/middlewares/global-error"));
const routes_1 = require("./app/routes");
const response_1 = __importDefault(require("./shared/response"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://lorry-lagbe-fe.vercel.app"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//router
app.use("/api/v1", routes_1.AppRouter);
//global error handler
app.use(global_error_1.default);
app.get("/", (req, res) => {
    return res.status(http_status_1.default.OK).json({
        success: true,
        message: `Lorry Lagbe app is running`,
    });
});
//route not found
app.use((req, res, next) => {
    return (0, response_1.default)({
        statusCode: http_status_1.default.NOT_FOUND,
        status: false,
        message: "API end-point not found",
    }, res);
});
exports.default = app;
