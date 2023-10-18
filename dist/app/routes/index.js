"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("../modules/auth/auth.router");
const users_router_1 = require("../modules/users/users.router");
const categories_router_1 = require("../modules/categories/categories.router");
const router = express_1.default.Router();
const routes = [
    { path: "/auth", module: auth_router_1.AuthRouter },
    { path: "/users", module: users_router_1.UserRouter },
    { path: "/categories", module: categories_router_1.CategoryRouter },
];
routes.forEach((route) => {
    router.use(route.path, route.module);
});
exports.AppRouter = router;
