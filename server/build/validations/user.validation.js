"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = exports.SendOTPToEmail = exports.VerifyUser = exports.LoginValidation = exports.CreateUserValidation = void 0;
const class_validator_1 = require("class-validator");
//create user validation
class CreateUserValidation {
}
exports.CreateUserValidation = CreateUserValidation;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], CreateUserValidation.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], CreateUserValidation.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)()
], CreateUserValidation.prototype, "email", void 0);
//login validation
class LoginValidation {
}
exports.LoginValidation = LoginValidation;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)()
], LoginValidation.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], LoginValidation.prototype, "password", void 0);
//verify OTP
class VerifyUser {
}
exports.VerifyUser = VerifyUser;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], VerifyUser.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], VerifyUser.prototype, "otp", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], VerifyUser.prototype, "token", void 0);
//resend otp
class SendOTPToEmail {
}
exports.SendOTPToEmail = SendOTPToEmail;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)()
], SendOTPToEmail.prototype, "email", void 0);
//reset password
class ResetPassword {
}
exports.ResetPassword = ResetPassword;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], ResetPassword.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], ResetPassword.prototype, "password", void 0);
