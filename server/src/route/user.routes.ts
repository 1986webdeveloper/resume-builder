import express from "express";
import { UserController } from "../controller/user.controller";
import { asyncHandler } from "../common/error.service";
import { verifyToken } from "../middleware/user.middleware";
const route = express.Router();

route.post("/createUser", asyncHandler(UserController.registerUser));

route.post("/login", asyncHandler(UserController.loginUser));

route.get(
  "/verifyOTP",
  [asyncHandler(verifyToken)],
  asyncHandler(UserController.verifyUserToken),
);

route.post("/resend_verification", asyncHandler(UserController.resendOTP));

route.post(
  "/reset_password",
  [asyncHandler(verifyToken)],
  asyncHandler(UserController.reset_password),
);

export const userRoute = route;
