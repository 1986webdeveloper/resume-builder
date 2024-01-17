"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUTCDate = void 0;
const moment_1 = __importDefault(require("moment"));
//#region  date to utc formate
const getUTCDate = (currDate = new Date()) => {
    return (0, moment_1.default)(currDate).utc();
};
exports.getUTCDate = getUTCDate;
//#endregion
