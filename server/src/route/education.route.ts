import express from "express";
import { asyncHandler } from "../common/error.service";
import { userAuth } from "../middleware/user.middleware";
import { EducationController } from "../controller/education.controller";
const route = express.Router();

route.post('/addEducation',
    [asyncHandler(userAuth)],
    asyncHandler(EducationController.addEducationDetails))

route.post('/editOrDeleteEducation',
    [asyncHandler(userAuth)],
    asyncHandler(EducationController.editOrDeleteEducation))

route.get('/getAllEducationDetails',
    [asyncHandler(userAuth)],
    asyncHandler(EducationController.getEducationDetails))
export const educationRoute = route