import express from "express";
import { asyncHandler } from "../common/error.service";
import { userAuth } from "../middleware/user.middleware";
import { SkillsController } from "../controller/skills.controller";
const route = express.Router();

//add skills route
route.post('/addSkills', [asyncHandler(userAuth)], asyncHandler(SkillsController.addSkills))

//update or delete skills
route.post('/editOrDelete', [asyncHandler(userAuth)], asyncHandler(SkillsController.editorDeleteSkills))

//get all skills by search
route.get('/getAllSkills', [asyncHandler(userAuth)], asyncHandler(SkillsController.getAllSkills))

export const skillsRoute = route
