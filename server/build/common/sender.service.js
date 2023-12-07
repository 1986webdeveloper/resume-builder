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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.senderService = void 0;
const error_service_1 = require("./error.service");
const mail_1 = __importDefault(require("@sendgrid/mail"));
//send grid api key set
mail_1.default.setApiKey((_a = process.env.SEND_GRID_API) !== null && _a !== void 0 ? _a : "");
exports.senderService = new class {
    //#region  send email
    sendEmail(option) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = option.email;
            const filePath = option.filePath;
            const subject = option === null || option === void 0 ? void 0 : option.subject;
            const content = option === null || option === void 0 ? void 0 : option.content;
            const html = option === null || option === void 0 ? void 0 : option.html;
            // if (!IS_PROD) return true;
            const msg = {
                to: email,
                from: process.env.SEND_EMAIL, // Replace with your verified sender email address
                subject: subject,
            };
            if (content)
                msg.text = content;
            if (html)
                msg.html = html;
            // send email using sendgrif
            return mail_1.default.send(msg)
                .then((success) => {
                return success;
            })
                .catch(error => {
                // console.log({ error )
                throw new error_service_1.HttpError(error);
            });
        });
    }
};
