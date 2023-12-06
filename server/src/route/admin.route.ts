import express from "express";
import { asyncHandler } from "../common/error.service";
import { userAuth } from "../middwares/user.middleware";
import { AdminController } from "../controller/admin.controller";
const route = express.Router();

route.post('/createSkils', [asyncHandler(userAuth)], asyncHandler(AdminController.createSkils))


export const adminRoutes = route