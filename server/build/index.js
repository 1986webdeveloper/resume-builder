"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./database/db.connection");
const server_1 = require("./server");
const app = (0, express_1.default)();
(0, server_1.Server)(app);
//config .env file
const port = process.env.PORT || 4500; //default port
// Response.prototype.json.apply(updateMethod)
app.listen(port, () => {
    console.log(`Server running on:${port}`);
});
