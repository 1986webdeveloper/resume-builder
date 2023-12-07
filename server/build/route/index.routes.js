"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_routes_1 = require("./user.routes");
//export main api route
exports.default = (app) => {
    //async handler for error throw
    app.use("/api/user/", user_routes_1.userRoute);
};
//routes
