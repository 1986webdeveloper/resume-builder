import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import "./database/db.connection";
import { Server } from "./server";
import { HttpError } from "./common/error.service";

const app: Application = express();
Server(app);
//config .env file
const port = process.env.PORT || 4500; //default port

// Response.prototype.json.apply(updateMethod)
app.listen(port, () => {
  console.log(`Server running on:${port}`);
});
