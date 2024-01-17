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
exports.userHelperService = void 0;
const constant_1 = require("../common/constant");
const crypt_service_1 = require("../common/crypt.service");
const sender_service_1 = require("../common/sender.service");
const string_1 = require("../common/string");
const user_service_1 = require("../service/user.service");
exports.userHelperService = new (class {
    constructor() { }
    //#region  send otp to user
    sendOTPtoUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_service_1.userService.checkUserExists({ _id: user_id }, true);
            const email = user === null || user === void 0 ? void 0 : user.email;
            //generate otp
            const otpDetails = crypt_service_1.CryptoService.generateOTP();
            yield user_service_1.userService.updateOtpDetails(user._id, {
                otp: otpDetails.otp,
            });
            const tokenPayload = JSON.stringify(Object.assign({ userId: user._id }, otpDetails));
            const token = crypt_service_1.CryptoService.encryptText(tokenPayload);
            const redirectRoute = `${process.env.VERIFY_REDIRECT_TOKEN}?token=${token}`;
            const html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification</title>
    </head>
    
    <body>
    <div>
    Please verify your mail
    <a href="${redirectRoute}">Verify here</a>
        </div>
        
        </body>
        
        </html>`;
            const emailOptions = {
                email,
                subject: string_1.email_verification_subject,
                html
            };
            //send email to user
            yield sender_service_1.senderService.sendEmail(emailOptions);
            return {
                userId: user._id,
                email: user.email,
                expire_min: constant_1.TOKEN_EXPIRE_MIN + "m",
            };
        });
    }
})();
