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
exports.userAuth = exports.verifyToken = void 0;
const user_service_1 = require("../service/user.service");
const error_service_1 = require("../common/error.service");
const string_1 = require("../common/string");
const constant_1 = require("../common/constant");
const crypt_service_1 = require("../common/crypt.service");
//#region  verify otp
function verifyToken(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const headers = req.headers;
        const token = (_b = (_a = headers === null || headers === void 0 ? void 0 : headers.authorization) === null || _a === void 0 ? void 0 : _a.split("Bearer")[1]) === null || _b === void 0 ? void 0 : _b.trim();
        if (!token)
            throw new error_service_1.HttpError(string_1.errorPleaseProvideAccessToken, constant_1.HTTP_STATUS_CODE.unauthorized);
        let userData = crypt_service_1.CryptoService.decryptText(token);
        if (!userData)
            throw new error_service_1.HttpError(string_1.errorPleaseProvideAccessToken, constant_1.HTTP_STATUS_CODE.unauthorized);
        userData = JSON.parse(userData);
        if (!(userData === null || userData === void 0 ? void 0 : userData.userId) || !(userData === null || userData === void 0 ? void 0 : userData.otp))
            throw new error_service_1.HttpError(string_1.errorPleaseProvideAccessToken, constant_1.HTTP_STATUS_CODE.unauthorized);
        const expireTime = userData.expireTime;
        const currentTime = new Date().getTime();
        if (currentTime >= expireTime)
            throw new error_service_1.HttpError(string_1.errorTokenExpire, constant_1.HTTP_STATUS_CODE.unauthorized);
        req.body.userId = userData.userId;
        req.body.otp = userData.otp;
        req.body.token = token;
        next();
    });
}
exports.verifyToken = verifyToken;
//#endregion
//#region user authentication
function userAuth(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const headers = req.headers;
        const token = (_b = (_a = headers === null || headers === void 0 ? void 0 : headers.authorization) === null || _a === void 0 ? void 0 : _a.split("Bearer")[1]) === null || _b === void 0 ? void 0 : _b.trim();
        if (!token)
            throw new error_service_1.HttpError(string_1.errorPleaseProvideAccessToken, constant_1.HTTP_STATUS_CODE.unauthorized);
        const is_verified = yield crypt_service_1.CryptoService.verifyJWTToken(token);
        if (!is_verified || !(is_verified === null || is_verified === void 0 ? void 0 : is_verified.userId))
            throw new error_service_1.HttpError(string_1.errorPleaseProvideAccessToken, constant_1.HTTP_STATUS_CODE.unauthorized);
        const userId = is_verified === null || is_verified === void 0 ? void 0 : is_verified.userId;
        const checkUser = yield user_service_1.userService.checkUserExists({ token }, true);
        if (!checkUser)
            throw new error_service_1.HttpError(string_1.errorPleaseProvideAccessToken, constant_1.HTTP_STATUS_CODE.unauthorized);
        req.body.userId = userId;
        req.query.userId = userId;
        next();
    });
}
exports.userAuth = userAuth;
