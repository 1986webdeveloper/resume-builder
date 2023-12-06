"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_routes_1 = __importDefault(require("./route/index.routes"));
//#region  application routing
const Server = (application) => {
    //required middleware
    applicationMiddleware(application);
    //application routing
    (0, index_routes_1.default)(application);
    //default return error if route not found
    application.use(function (req, res) {
        return res.status(404).json({
            message: "Not found",
        });
    });
};
exports.Server = Server;
//#region application middlware
const applicationMiddleware = (application) => {
    application.use((0, cors_1.default)());
    application.use(body_parser_1.default.json());
    application.use(body_parser_1.default.urlencoded({ extended: true }));
    //error handling middleware
};
//#endregion
