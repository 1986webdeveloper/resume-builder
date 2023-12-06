import { Application, NextFunction, Request, Response } from "express";
import { userRoute } from "./user.routes";

//export main api route
export default (app: Application) => {
  //async handler for error throw

  app.use("/api/user/", userRoute);
};
//routes
