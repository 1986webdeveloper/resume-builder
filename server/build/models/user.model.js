"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constant_1 = require("../common/constant");
const crypt_service_1 = require("../common/crypt.service");
// user schema define here
const userSchema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        required: true,
        maxLength: 20,
    },
    last_name: {
        type: String,
        required: true,
        maxLength: 20,
    },
    email: {
        type: String,
        required: true,
        set: crypt_service_1.CryptoService.encryptText,
        get: crypt_service_1.CryptoService.decryptText,
        maxLength: 255,
    },
    password: {
        type: String,
        required: false,
    },
    otp: {
        type: String,
        required: false,
    },
    token: {
        type: String,
        required: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    password_attemps: {
        type: Number,
        required: false,
        default: 0
    },
    cool_off_date: {
        type: Date,
        required: false
    }
});
//create new user model
exports.UserModel = mongoose_1.default.model(constant_1.ModelName.userModel, userSchema);
