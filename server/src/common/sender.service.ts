import { SendEmail } from "../interface/sender.interface";
import { HttpError } from "./error.service";
import { errorEmailNotSent } from "./string";
import { IS_PROD } from "./constant";
import sgGmail, { MailDataRequired } from '@sendgrid/mail'
//send grid api key set
sgGmail.setApiKey(process.env.SEND_GRID_API ?? "")
export const senderService = new class {

  //#region  send email
  async sendEmail(option: SendEmail) {
    const email = option.email;
    const filePath = option.filePath;
    const subject = option?.subject;
    const content = option?.content;
    const html = option?.html
    // if (!IS_PROD) return true;

    const msg: any = {
      to: email,
      from: process.env.SEND_EMAIL,// Replace with your verified sender email address
      subject: subject,
    };
    if (content) msg.text = content
    if (html) msg.html = html
    // send email using sendgrif
    return sgGmail.send(msg)
      .then((success) => {
        return success
      })
      .catch(error => {
        // console.log({ error )
        throw new HttpError(error)
      });

  }
  //#endregion
}
