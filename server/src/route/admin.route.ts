import express from "express";
import { asyncHandler } from "../common/error.service";
import { userAuth } from "../middleware/user.middleware";
import { AdminController } from "../controller/admin.controller";
const route = express.Router();

route.get('/getAllowedDesignation', [asyncHandler(userAuth)], asyncHandler(AdminController.designationList))

route.post('/addDesignationSummary', [asyncHandler(userAuth)], asyncHandler(AdminController.addDesignationSummary),)

route.post('/updateDesignationOrSummary', [asyncHandler(userAuth)], asyncHandler(AdminController.editDesignationOrSummary),)

route.get('/getDesignationOrSummaryList', [asyncHandler(userAuth)], asyncHandler(AdminController.getDesignationList),)

export const adminRoutes = route