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
exports.UserController = void 0;
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const response_1 = __importDefault(require("../../../shared/response"));
const users_service_1 = require("./users.service");
const insertUser = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const result = yield users_service_1.UserService.insertUser(user);
    return (0, response_1.default)({ message: "User inserted  successfully", result }, res);
}));
const updateUser = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = req.body;
    const user = req.user;
    const result = yield users_service_1.UserService.updateUser(id, data, user);
    return (0, response_1.default)({ message: "User updated  successfully", result }, res);
}));
const deleteUser = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield users_service_1.UserService.deleteUser(id);
    return (0, response_1.default)({ message: "User deleted  successfully", result }, res);
}));
const userProfile = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield users_service_1.UserService.findOneUser(user.userId);
    return (0, response_1.default)({ message: "User profile fetched successfully", result }, res);
}));
const findOneUser = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield users_service_1.UserService.findOneUser(id);
    return (0, response_1.default)({ message: "User fetched successfully", result }, res);
}));
const findUsers = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_service_1.UserService.findUsers();
    return (0, response_1.default)({ message: "Users retrieved successfully", result }, res);
}));
exports.UserController = {
    insertUser,
    updateUser,
    deleteUser,
    userProfile,
    findOneUser,
    findUsers,
};
