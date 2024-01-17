"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const host = process.env.DB_HOST || "";
const port = process.env.DB_PORT || "";
const db_name = process.env.DATABASE || "";
const db_uri = `mongodb://${host}:${port}/${db_name}`;
mongoose_1.default
    .connect(db_uri, {
    autoIndex: true,
    autoCreate: true,
})
    .then(() => {
    console.log("connection to database : " + db_name);
})
    .catch((error) => {
    console.log("Database not connected");
});
