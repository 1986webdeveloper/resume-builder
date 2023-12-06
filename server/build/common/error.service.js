"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidation = exports.asyncHandler = exports.HttpError = void 0;
const constant_1 = require("./constant");
const class_validator_1 = require("class-validator");
//#region custom error handler
class HttpError extends Error {
    constructor(message, statusCode = constant_1.HTTP_STATUS_CODE.internal_error) {
        super(message);
        this.statusCode = statusCode !== null && statusCode !== void 0 ? statusCode : constant_1.HTTP_STATUS_CODE.internal_error;
        this.name = this.constructor.name;
    }
}
exports.HttpError = HttpError;
//#endregion
//#region  async handler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((errorObj) => {
        if (errorObj instanceof HttpError) {
            return res
                .status(errorObj.statusCode)
                .json({ error: errorObj.message });
        }
        else {
            // Handle other types of errors
            return res
                .status(constant_1.HTTP_STATUS_CODE.internal_error)
                .json({ error: "Internal Server Error" });
        }
    });
};
exports.asyncHandler = asyncHandler;
//#endregion
//#region validation payloads
const checkValidation = (userInput) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //check validation payloads
    const validateUser = yield (0, class_validator_1.validate)(userInput);
    const isErrorFound = validateUser.find((val) => true);
    const messageObj = (_a = isErrorFound === null || isErrorFound === void 0 ? void 0 : isErrorFound.constraints) !== null && _a !== void 0 ? _a : {};
    for (const key in messageObj) {
        throw new HttpError(messageObj[key], constant_1.HTTP_STATUS_CODE.bad_request);
    }
});
exports.checkValidation = checkValidation;
//#endregion
