import express from "express";
import { asyncHandler } from "../common/error.service";
import { userAuth } from "../middleware/user.middleware";
import { GeographicalService } from "../migration/geographical.migration";
const route = express.Router();

route.post('/migrateLocation',
    [asyncHandler(userAuth)],
    asyncHandler(GeographicalService.migrateCountries))
export const migrationRoute = route