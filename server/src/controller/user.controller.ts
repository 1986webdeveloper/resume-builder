import { Response, Request } from "express";
import { userService } from "../service/user.service";
import {
  CreateUserValidation,
  LoginValidation,
  ResetPassword,
  SendOTPToEmail,
  VerifyUser,
} from "../validations/user.validation";
import { HttpError, checkValidation } from "../common/error.service";
import { CryptoService } from "../common/crypt.service";
import { CreateUser } from "../interface/user.interface";
import {
  errorEmailNotFound,
  errorIncorrectPassword,
  errorPleaseChangeYourpassword,
  errorTokenExpire,
  errorUserNotVerified,
  successPasswordSet,
  successPleaseverifyEmail,
  successUserLogin,
  successUserVerified,
} from "../common/string";
import { HTTP_STATUS_CODE, LOGIN_TOKEN_EXPIRE, TOTAL_PASSWORD_ATTEMPS } from "../common/constant";
import { userHelperService } from "../helper.services.ts/user.helper";
export class UserController {
  //#region register user
  static async registerUser(req: Request, res: Response): Promise<Response> {
    const input: CreateUserValidation = req.body;
    const userInput = new CreateUserValidation();
    userInput.first_name = input.first_name;
    userInput.last_name = input.last_name;
    userInput.email = input.email;
    //check validation
    await checkValidation({ email: userInput.email });
    //check if user already exits
    await userService.checkUserExists({ email: userInput.email });
    const payload: CreateUser = {
      first_name: userInput.first_name,
      last_name: userInput.last_name,
      full_name: userInput.first_name + "" + userInput.last_name,
      email: userInput.email,
    };
    // user service for create user
    const response = await userService.createUser(payload);
    //send verification email
    const sentDataResponse = await userHelperService.sendOTPtoUser(
      response._id,
    );
    return res
      .status(HTTP_STATUS_CODE.success)
      .json({ message: successPleaseverifyEmail, data: sentDataResponse });
  }
  //#endregion

  //#region  login user
  static async loginUser(req: Request, res: Response): Promise<Response> {
    const input: LoginValidation = req.body;
    const userInput = new LoginValidation();
    userInput.email = input.email;
    userInput.password = input.password;
    //check validation
    await checkValidation(userInput);
    //check user exits or not
    const userData: any = await userService.checkUserExists(
      { email: userInput.email },
      true,
    );

    if (!userData)
      throw new HttpError(errorEmailNotFound, HTTP_STATUS_CODE.not_found);
    //check user is verified or not
    if (!userData?.verified) throw new HttpError(errorUserNotVerified, HTTP_STATUS_CODE.not_found);
    //check user password set or not
    if (!userData?.password) throw new HttpError(errorPleaseChangeYourpassword, HTTP_STATUS_CODE.not_found);

    //check password match or not
    const is_password_match = await CryptoService.verifyPassword(
      userInput.password,
      userData?.password,
    );
    //check user is blocked or not
    await userService.checkUserCoolOfdate(userData)
    if (!is_password_match) {
      //check wrong password attemps
      await userService.checkWrongPasswordAttemps(userData)
      throw new HttpError(
        errorIncorrectPassword,
        HTTP_STATUS_CODE.unauthorized,
      );
    }
    //token expire time
    const expireTime = LOGIN_TOKEN_EXPIRE + 'h'
    const token_payload = { userId: userData._id, email: userData.email };
    const token = await CryptoService.geneateWebToken(token_payload, expireTime);
    await userService.updateUser({ _id: userData._id }, { token, password_attemps: 0 });
    const responseData = {
      _id: userData._id,
      email: userInput.email,
      token: token,
    };
    return res
      .status(HTTP_STATUS_CODE.success)
      .json({ message: successUserLogin, data: responseData });
  }
  //#endregion

  //#region verify user new login
  static async verifyUserToken(req: Request, res: Response): Promise<Response> {
    const input: VerifyUser = req.body;
    const userInput = new VerifyUser();
    userInput.userId = input.userId;
    userInput.token = input.token;
    userInput.otp = input.otp;
    await checkValidation(userInput);
    //get user data
    const checkUser = await userService.checkUserExists(
      {
        _id: userInput.userId,
        otp: userInput.otp,
      },
      true,
    );
    if (!checkUser)
      throw new HttpError(errorTokenExpire, HTTP_STATUS_CODE.unauthorized);
    const updateData = { otp: null, verified: true };
    await userService.updateUser(
      { _id: checkUser._id },
      updateData,
    );
    //redirect url for forgot password
    const responseData = {
      _id: checkUser._id,
      email: checkUser.email,
      token: userInput.token,
    };
    return res
      .status(HTTP_STATUS_CODE.success)
      .json({ message: successUserVerified, data: responseData });
  }
  //#endregion

  //#region resend link to user
  static async resendOTP(req: Request, res: Response): Promise<Response> {
    const input: SendOTPToEmail = req.body;
    const userInput = new SendOTPToEmail();
    userInput.email = input.email;
    await checkValidation(userInput);
    //get user data
    const checkUser = await userService.checkUserExists(
      {
        email: userInput.email,
      },
      true,
    );
    if (!checkUser)
      throw new HttpError(errorEmailNotFound, HTTP_STATUS_CODE.unauthorized);
    const sentDataResponse = await userHelperService.sendOTPtoUser(
      checkUser._id,
    );
    return res
      .status(HTTP_STATUS_CODE.success)
      .json({ message: successPleaseverifyEmail, data: sentDataResponse });
  }
  //#endregion

  //#region forgot or set password
  static async reset_password(req: Request, res: Response): Promise<Response> {
    const input: ResetPassword = req.body;
    const userInput = new ResetPassword();
    userInput.userId = input.userId;
    userInput.password = input.password;
    await checkValidation(userInput);
    const options = {
      _id: userInput.userId,
    };
    const checkUser = await userService.checkUserExists(options, true);
    //check user exist or not
    if (!checkUser)
      throw new HttpError(errorEmailNotFound, HTTP_STATUS_CODE.unauthorized);
    //update password and token details
    await userService.updateUser(
      { _id: checkUser._id },
      {
        password: await CryptoService.hashPassword(userInput.password),
      },
    );
    //custom response
    const responseData = {
      userId: checkUser._id,
      email: checkUser.email,
    };
    return res
      .status(HTTP_STATUS_CODE.create_success)
      .json({ message: successPasswordSet, data: responseData });
  }
  //#endregion
}
