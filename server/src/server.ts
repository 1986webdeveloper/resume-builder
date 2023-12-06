import { Application, NextFunction, Request, Response } from "express";
import { HttpError } from "./common/error.service";
import { CustomError } from "./common/interfaces";
import { HTTP_STATUS_CODE } from "./common/constant";
import cors from "cors";
import bodyParser from "body-parser";
import applicationRouting from "./route/index.routes";

//#region  application routing
export const Server = (application: Application) => {
  //required middleware
  applicationMiddleware(application);

  //application routing
  applicationRouting(application);

  //default return error if route not found
  application.use(function (req, res) {
    return res.status(404).json({
      message: "Not found",
    });
  });
};

//#region application middlware
const applicationMiddleware = (application: Application) => {
  application.use(cors());
  application.use(bodyParser.json());
  application.use(bodyParser.urlencoded({ extended: true }));
  //error handling middleware
};
//#endregion
