import moment from "moment";
import { UserModel } from "../models/user.model";
import { CreateUser, UpdateOtp } from "../interface/user.interface";
import { HttpError, checkValidation } from "../common/error.service";
import {
  errorTomanyAttempsOfPassword,
  errorUserAlreadyExist,
  errorUserNotCreated,
  errorUserNotFound,
  errorYourAccountBlockedTemp,
} from "../common/string";
import { COOL_OFF_MIN, HTTP_STATUS_CODE, TOTAL_PASSWORD_ATTEMPS } from "../common/constant";
import { getUTCDate } from "../common/common";

//user service
export const userService = new (class {
  constructor() { }
  //#region  create user
  async createUser(payload: CreateUser) {
    //create user
    const newUser: any = await new UserModel(payload).save();
    if (!newUser) throw new HttpError(errorUserNotCreated);
    return newUser;
  }
  //#endregion

  //#region  get user data
  async getUserData(user_id: string | Object) {
    const user = await UserModel.findById(user_id).select([
      "_id",
      "email",
      "full_name",
      "otp",
    ]);
    //check user is exist or not
    if (!user)
      throw new HttpError(errorUserNotFound, HTTP_STATUS_CODE.not_found);
    return user;
  }
  //#endregion

  //#region  user update
  async updateOtpDetails(user_id: Object, updateData?: UpdateOtp) {
    const update = await UserModel.updateOne({ _id: user_id }, updateData);
    return update;
  }
  //#endregion

  //#region  update user details
  async updateUser(userWhere: any, updateData: any) {
    return await UserModel.updateOne(userWhere, updateData);
  }
  //#endregion

  //#region  check user present or not
  async checkUserExists(options: any, required: boolean = false) {
    const user = await UserModel.findOne(options).select([
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
      throw new HttpError(errorUserAlreadyExist, HTTP_STATUS_CODE.found);

    return user;
  }
  //#endregion

  //#region check wrong password attemps and cool off date
  async checkWrongPasswordAttemps(userData: any) {
    const password_attemps: number = userData?.password_attemps ?? 0
    const updateOperation: any = {}
    let is_cool_off = false
    if (password_attemps == TOTAL_PASSWORD_ATTEMPS) {
      const currentDate = getUTCDate().add(COOL_OFF_MIN, 'minutes')
      updateOperation.cool_off_date = currentDate
      is_cool_off = true
    } else
      updateOperation["$inc"] = { password_attemps: 1 }
    await userService.updateUser({ _id: userData._id }, updateOperation)
    if (is_cool_off)
      throw new HttpError(errorTomanyAttempsOfPassword)
  }
  //#endregion

  //#region  check cool of date
  async checkUserCoolOfdate(userData: any) {
    if (!userData.cool_off_date) return true
    const cool_off_date = new Date(userData.cool_off_date)
      .getTime()
    const currentUTC = getUTCDate().toJSON()
    const currentDate = new Date(currentUTC)
      .getTime()
    if (cool_off_date > currentDate) throw new HttpError(errorYourAccountBlockedTemp)
    const updateOperation = { cool_off_date: null }
    await userService.updateUser({ _id: userData._id }, updateOperation)
  }
  //#endregion
})();
