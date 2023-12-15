import { Application, NextFunction, Request, Response } from "express";
import { userRoute } from "./user.routes";
import { adminRoutes } from "./admin.route";
import { skillsRoute } from "./skills.route";
import { educationRoute } from "./education.route";
import { migrationRoute } from "./migration.route";
import { helperRoute } from "./helper.route";
import { resumeRouter } from "./resume.route";

//export main api route
export default (app: Application) => {
  //async handler for error throw

  app.use("/api/user/", userRoute);

  app.use("/api/admin/", adminRoutes)

  app.use('/api/skills/', skillsRoute)

  app.use('/api/education/', educationRoute)

  app.use('/api/migration/', migrationRoute)

  app.use('/api/helper/', helperRoute)

  app.use('/api/resume/', resumeRouter)
};
//routes
