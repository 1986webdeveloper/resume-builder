import { Application, NextFunction, Request, Response } from "express";
import { userRoute } from "./user.routes";
import { adminRoutes } from "./admin.route";

//export main api route
export default (app: Application) => {
  //async handler for error throw

  app.use("/api/user/", userRoute);

  app.use("/api/admin/", adminRoutes)
};
//routes
