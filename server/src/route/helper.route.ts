import express from "express";
import { asyncHandler } from "../common/error.service";
import { userAuth } from "../middleware/user.middleware";
import { GeographicalService } from "../migration/geographical.migration";
const route = express.Router();

route.get('/getAllCounties',
    [asyncHandler(userAuth)],
    asyncHandler(GeographicalService.getAllCounties))

route.get('/getAllState',
    [asyncHandler(userAuth)],
    asyncHandler(GeographicalService.getAllStates))

route.get('/getAllCities',
    [asyncHandler(userAuth)],
    asyncHandler(GeographicalService.getAllCities))

route.get('/getUniversity', [asyncHandler(userAuth)],
    asyncHandler(GeographicalService.getUniversity))

export const helperRoute = route