import express from "express";
import { asyncHandler } from "../common/error.service";
import { userAuth } from "../middleware/user.middleware";
import { ResumeController } from "../controller/resume.controller";
const route = express.Router();

route.post('/createUserResume',
    asyncHandler(userAuth),
    asyncHandler(ResumeController.createUserBasicDetails))
route.get('/resumeInfo', asyncHandler(userAuth),
    asyncHandler(ResumeController.getResumeInfo))

route.get('/resumeList', asyncHandler(userAuth),
    asyncHandler(ResumeController.getAllResumeList))

route.post('/createResumeSchema', asyncHandler(userAuth), asyncHandler(ResumeController.createResumeSchema))

route.post('/editOrDeleteResumeSchema',
    asyncHandler(userAuth),
    asyncHandler(ResumeController.editOrDeleteResumeSchema))
route.post('/changeSectionOrder', asyncHandler(userAuth),
    asyncHandler(ResumeController.editOrDeleteResumeSchema))

route.post('/editOrDeleteUserResume', asyncHandler(userAuth),
    asyncHandler(ResumeController.editOrDeleteUserResume))

export const resumeRouter = route