import { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import applicationRouting from "./route/index.routes";
import express from "express";
import path from "path";
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
  application.set("files", __dirname + "/files");
  application.use(
    "/upload",
    express.static(path.join(__dirname, "..", "upload"))
  );
  //error handling middleware
};
//#endregion
