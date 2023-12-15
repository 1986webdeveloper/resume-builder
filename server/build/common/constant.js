"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_PROD = exports.IS_UAT = exports.IS_DEV = exports.COOL_OFF_MIN = exports.TOTAL_PASSWORD_ATTEMPS = exports.LOGIN_TOKEN_EXPIRE = exports.TOKEN_EXPIRE_MIN = exports.ModelName = exports.HTTP_STATUS_CODE = void 0;
exports.HTTP_STATUS_CODE = {
    not_found: 404,
    found: 403,
    unauthorized: 401,
    bad_request: 400,
    success: 200,
    create_success: 201,
    internal_error: 500,
};
// database models
exports.ModelName = {
    userModel: "User",
};
//#endregion
//Token expire time
exports.TOKEN_EXPIRE_MIN = 15;
exports.LOGIN_TOKEN_EXPIRE = 24;
exports.TOTAL_PASSWORD_ATTEMPS = 3;
exports.COOL_OFF_MIN = 15;
//node env
exports.IS_DEV = process.env.NODE_ENV != "uat" && process.env.NODE_ENV != "prod";
exports.IS_UAT = process.env.NODE_ENV == "uat";
exports.IS_PROD = process.env.NODE_ENV == "prod";

export const DATA_TYPE = ['string', 'boolean', 'date', 'date with timestamp', 'number']