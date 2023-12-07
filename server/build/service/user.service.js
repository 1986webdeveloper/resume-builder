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
exports.userService = void 0;
const user_model_1 = require("../models/user.model");
const error_service_1 = require("../common/error.service");
const string_1 = require("../common/string");
const constant_1 = require("../common/constant");
const common_1 = require("../common/common");
//user service
exports.userService = new (class {
    constructor() { }
    //#region  create user
    createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            //create user
            const newUser = yield new user_model_1.UserModel(payload).save();
            if (!newUser)
                throw new error_service_1.HttpError(string_1.errorUserNotCreated);
            return newUser;
        });
    }
    //#endregion
    //#region  get user data
    getUserData(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findById(user_id).select([
                "_id",
                "email",
                "full_name",
                "otp",
            ]);
            //check user is exist or not
            if (!user)
                throw new error_service_1.HttpError(string_1.errorUserNotFound, constant_1.HTTP_STATUS_CODE.not_found);
            return user;
        });
    }
    //#endregion
    //#region  user update
    updateOtpDetails(user_id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield user_model_1.UserModel.updateOne({ _id: user_id }, updateData);
            return update;
        });
    }
    //#endregion
    //#region  update user details
    updateUser(userWhere, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.UserModel.updateOne(userWhere, updateData);
        });
    }
    //#endregion
    //#region  check user present or not
    checkUserExists(options, required = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findOne(options).select([
                "_id",
                "email",
                "full_name",
                "otp",
                "password",
                "verified",
                "password_attemps",
                "cool_off_date"
            ]);
            if (user && !required)
                throw new error_service_1.HttpError(string_1.errorUserAlreadyExist, constant_1.HTTP_STATUS_CODE.found);
            return user;
        });
    }
    //#endregion
    //#region check wrong password attemps and cool off date
    checkWrongPasswordAttemps(userData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const password_attemps = (_a = userData === null || userData === void 0 ? void 0 : userData.password_attemps) !== null && _a !== void 0 ? _a : 0;
            const updateOperation = {};
            let is_cool_off = false;
            if (password_attemps == constant_1.TOTAL_PASSWORD_ATTEMPS) {
                const currentDate = (0, common_1.getUTCDate)().add(constant_1.COOL_OFF_MIN, 'minutes');
                updateOperation.cool_off_date = currentDate;
                is_cool_off = true;
            }
            else
                updateOperation["$inc"] = { password_attemps: 1 };
            yield exports.userService.updateUser({ _id: userData._id }, updateOperation);
            if (is_cool_off)
                throw new error_service_1.HttpError(string_1.errorTomanyAttempsOfPassword);
        });
    }
    //#endregion
    //#region  check cool of date
    checkUserCoolOfdate(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userData.cool_off_date)
                return true;
            const cool_off_date = new Date(userData.cool_off_date)
                .getTime();
            const currentUTC = (0, common_1.getUTCDate)().toJSON();
            const currentDate = new Date(currentUTC)
                .getTime();
            if (cool_off_date > currentDate)
                throw new error_service_1.HttpError(string_1.errorYourAccountBlockedTemp);
            const updateOperation = { cool_off_date: null };
            yield exports.userService.updateUser({ _id: userData._id }, updateOperation);
        });
    }
})();
