import express from "express";
import { asyncHandler } from "../common/error.service";
import { userAuth } from "../middwares/user.middleware";
const route = express.Router();

// route.post('/createProfile', [asyncHandler(userAuth)], asyncHandler())
