import { HTTP_STATUS_CODE, TOKEN_EXPIRE_MIN } from "../common/constant";
import { CryptoService } from "../common/crypt.service";
import { HttpError } from "../common/error.service";
import { senderService } from "../common/sender.service";
import {
  email_verification_subject,
  errorEmailNotFound,
} from "../common/string";
import { userService } from "../service/user.service";

export const userHelperService = new (class {
  constructor() { }

  //#region  send otp to user
  async sendOTPtoUser(user_id: string | Object) {
    const user: any = await userService.checkUserExists({ _id: user_id }, true);
    const email = user?.email;
    //generate otp
    const otpDetails = CryptoService.generateOTP();
    await userService.updateOtpDetails(user._id, {
      otp: otpDetails.otp,
    });
    const tokenPayload = JSON.stringify({ userId: user._id, ...otpDetails });
    const token = CryptoService.encryptText(tokenPayload);
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
        
        </html>`
    const emailOptions = {
      email,
      subject: email_verification_subject,
      html
    };
    //send email to user
    await senderService.sendEmail(emailOptions);

    return {
      userId: user._id,
      email: user.email,
      expire_min: TOKEN_EXPIRE_MIN + "m",
    };
  }
  //#endregion
})();
