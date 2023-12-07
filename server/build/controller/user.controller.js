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
exports.UserController = void 0;
const user_service_1 = require("../service/user.service");
const user_validation_1 = require("../validations/user.validation");
const error_service_1 = require("../common/error.service");
const crypt_service_1 = require("../common/crypt.service");
const string_1 = require("../common/string");
const constant_1 = require("../common/constant");
const user_helper_1 = require("../helper.services.ts/user.helper");
class UserController {
    //#region register user
    static registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = req.body;
            const userInput = new user_validation_1.CreateUserValidation();
            userInput.first_name = input.first_name;
            userInput.last_name = input.last_name;
            userInput.email = input.email;
            //check validation
            yield (0, error_service_1.checkValidation)({ email: userInput.email });
            //check if user already exits
            yield user_service_1.userService.checkUserExists({ email: userInput.email });
            const payload = {
                first_name: userInput.first_name,
                last_name: userInput.last_name,
                full_name: userInput.first_name + "" + userInput.last_name,
                email: userInput.email,
            };
            // user service for create user
            const response = yield user_service_1.userService.createUser(payload);
            //send verification email
            const sentDataResponse = yield user_helper_1.userHelperService.sendOTPtoUser(response._id);
            return res
                .status(constant_1.HTTP_STATUS_CODE.success)
                .json({ message: string_1.successPleaseverifyEmail, data: sentDataResponse });
        });
    }
    //#endregion
    //#region  login user
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = req.body;
            const userInput = new user_validation_1.LoginValidation();
            userInput.email = input.email;
            userInput.password = input.password;
            //check validation
            yield (0, error_service_1.checkValidation)(userInput);
            //check user exits or not
            const userData = yield user_service_1.userService.checkUserExists({ email: userInput.email }, true);
            if (!userData)
                throw new error_service_1.HttpError(string_1.errorEmailNotFound, constant_1.HTTP_STATUS_CODE.not_found);
            //check user is verified or not
            if (!(userData === null || userData === void 0 ? void 0 : userData.verified))
                throw new error_service_1.HttpError(string_1.errorUserNotVerified, constant_1.HTTP_STATUS_CODE.not_found);
            //check user password set or not
            if (!(userData === null || userData === void 0 ? void 0 : userData.password))
                throw new error_service_1.HttpError(string_1.errorPleaseChangeYourpassword, constant_1.HTTP_STATUS_CODE.not_found);
            //check password match or not
            const is_password_match = yield crypt_service_1.CryptoService.verifyPassword(userInput.password, userData === null || userData === void 0 ? void 0 : userData.password);
            //check user is blocked or not
            yield user_service_1.userService.checkUserCoolOfdate(userData);
            if (!is_password_match) {
                //check wrong password attemps
                yield user_service_1.userService.checkWrongPasswordAttemps(userData);
                throw new error_service_1.HttpError(string_1.errorIncorrectPassword, constant_1.HTTP_STATUS_CODE.unauthorized);
            }
            //token expire time
            const expireTime = constant_1.LOGIN_TOKEN_EXPIRE + 'h';
            const token_payload = { userId: userData._id, email: userData.email };
            const token = yield crypt_service_1.CryptoService.geneateWebToken(token_payload, expireTime);
            yield user_service_1.userService.updateUser({ _id: userData._id }, { token, password_attemps: 0 });
            const responseData = {
                _id: userData._id,
                email: userInput.email,
                token: token,
            };
            return res
                .status(constant_1.HTTP_STATUS_CODE.success)
                .json({ message: string_1.successUserLogin, data: responseData });
        });
    }
    //#endregion
    //#region verify user new login
    static verifyUserToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = req.body;
            const userInput = new user_validation_1.VerifyUser();
            userInput.userId = input.userId;
            userInput.token = input.token;
            userInput.otp = input.otp;
            yield (0, error_service_1.checkValidation)(userInput);
            //get user data
            const checkUser = yield user_service_1.userService.checkUserExists({
                _id: userInput.userId,
                otp: userInput.otp,
            }, true);
            if (!checkUser)
                throw new error_service_1.HttpError(string_1.errorTokenExpire, constant_1.HTTP_STATUS_CODE.unauthorized);
            const updateData = { otp: null, verified: true };
            yield user_service_1.userService.updateUser({ _id: checkUser._id }, updateData);
            //redirect url for forgot password
            const responseData = {
                _id: checkUser._id,
                email: checkUser.email,
                token: userInput.token,
            };
            return res
                .status(constant_1.HTTP_STATUS_CODE.success)
                .json({ message: string_1.successUserVerified, data: responseData });
        });
    }
    //#endregion
    //#region resend link to user
    static resendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = req.body;
            const userInput = new user_validation_1.SendOTPToEmail();
            userInput.email = input.email;
            yield (0, error_service_1.checkValidation)(userInput);
            //get user data
            const checkUser = yield user_service_1.userService.checkUserExists({
                email: userInput.email,
            }, true);
            if (!checkUser)
                throw new error_service_1.HttpError(string_1.errorEmailNotFound, constant_1.HTTP_STATUS_CODE.unauthorized);
            const sentDataResponse = yield user_helper_1.userHelperService.sendOTPtoUser(checkUser._id);
            return res
                .status(constant_1.HTTP_STATUS_CODE.success)
                .json({ message: string_1.successPleaseverifyEmail, data: sentDataResponse });
        });
    }
    //#endregion
    //#region forgot or set password
    static reset_password(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = req.body;
            const userInput = new user_validation_1.ResetPassword();
            userInput.userId = input.userId;
            userInput.password = input.password;
            yield (0, error_service_1.checkValidation)(userInput);
            const options = {
                _id: userInput.userId,
            };
            const checkUser = yield user_service_1.userService.checkUserExists(options, true);
            //check user exist or not
            if (!checkUser)
                throw new error_service_1.HttpError(string_1.errorEmailNotFound, constant_1.HTTP_STATUS_CODE.unauthorized);
            //update password and token details
            yield user_service_1.userService.updateUser({ _id: checkUser._id }, {
                password: yield crypt_service_1.CryptoService.hashPassword(userInput.password),
            });
            //custom response
            const responseData = {
                userId: checkUser._id,
                email: checkUser.email,
            };
            return res
                .status(constant_1.HTTP_STATUS_CODE.create_success)
                .json({ message: string_1.successPasswordSet, data: responseData });
        });
    }
}
exports.UserController = UserController;
