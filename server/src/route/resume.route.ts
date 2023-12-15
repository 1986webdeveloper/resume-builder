import express from "express";
import { asyncHandler } from "../common/error.service";
import { userAuth } from "../middleware/user.middleware";
import { ResumeController } from "../controller/resume.controller";
const route = express.Router();

route.post('/createProfile',
    asyncHandler(userAuth),
    asyncHandler(ResumeController.createUserBasicDetails))
route.post('/resumeInfo', asyncHandler(userAuth),
    asyncHandler(ResumeController.getResumeInfo))

route.post('/createResumeSchema', asyncHandler(userAuth), asyncHandler(ResumeController.createResumeSchema))
export const resumeRouter = route