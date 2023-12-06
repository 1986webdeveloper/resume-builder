"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoService = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const constant_1 = require("./constant");
const error_service_1 = require("./error.service");
const string_1 = require("./string");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const algorithm = "aes-256-cbc";
const randomKey = (_a = process.env.ENCRYPT_KEY) !== null && _a !== void 0 ? _a : "";
const randomIv = (_b = process.env.ENCRYPT_IV) !== null && _b !== void 0 ? _b : "";
const tokenSecret = (_c = process.env.JWT_SECRET) !== null && _c !== void 0 ? _c : "";
class CryptoService {
    //#region create json web token
    static geneateWebToken(options, expireTime = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const otherOptions = {};
            if (expireTime)
                otherOptions.expiresIn = expireTime;
            const tokenDetails = yield jwt.sign(options, tokenSecret, otherOptions);
            if (!tokenDetails)
                throw new error_service_1.HttpError(string_1.errotTokenNotCreated);
            return tokenDetails;
        });
    }
    //#endregion
    //#region  verify token
    static verifyJWTToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield jwt.verify(token, tokenSecret);
        });
    }
    //#region generate otp with expire time
    static generateOTP() {
        // Generate a random 4-digit number
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        //add expire time of 1min for expire otp
        const currentDate = new Date();
        const expireTime = currentDate.setMinutes(currentDate.getMinutes() + constant_1.TOKEN_EXPIRE_MIN);
        return { otp, expireTime: expireTime };
    }
    //#endregion
    //#region hash password
    static hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRound = 10;
            return yield bcryptjs_1.default.hashSync(password, saltRound);
        });
    }
    //#endregion
    //#region  verify password
    static verifyPassword(text, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compareSync(text, hash);
        });
    }
    //#endregion
    //#region encrypt text
    static encryptText(text) {
        if (!text) {
            return "";
        }
        const cipher = crypto_1.default.createCipheriv(algorithm, randomKey, randomIv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString("hex");
    }
    //#endregion
    //#region  decrypt text
    static decryptText(encryptText) {
        if (!encryptText)
            return "";
        const encryptedText = Buffer.from(encryptText, "hex");
        const decipher = crypto_1.default.createDecipheriv(algorithm, randomKey, randomIv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
exports.CryptoService = CryptoService;
