"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const error_service_1 = require("../common/error.service");
const user_middleware_1 = require("../middwares/user.middleware");
const route = express_1.default.Router();
route.post("/createUser", (0, error_service_1.asyncHandler)(user_controller_1.UserController.registerUser));
route.post("/login", (0, error_service_1.asyncHandler)(user_controller_1.UserController.loginUser));
route.get("/verifyOTP", [(0, error_service_1.asyncHandler)(user_middleware_1.verifyToken)], (0, error_service_1.asyncHandler)(user_controller_1.UserController.verifyUserToken));
route.post("/resend_verification", (0, error_service_1.asyncHandler)(user_controller_1.UserController.resendOTP));
route.post("/reset_password", [(0, error_service_1.asyncHandler)(user_middleware_1.verifyToken)], (0, error_service_1.asyncHandler)(user_controller_1.UserController.reset_password));
exports.userRoute = route;
