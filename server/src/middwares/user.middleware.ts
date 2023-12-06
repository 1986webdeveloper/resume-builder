import { Request, Response, NextFunction } from "express";
import { userService } from "../service/user.service";
import { HttpError } from "../common/error.service";
import {
  errorPleaseProvideAccessToken,
  errorTokenExpire,
} from "../common/string";
import { HTTP_STATUS_CODE } from "../common/constant";
import { CryptoService } from "../common/crypt.service";

//#region  verify otp
export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const headers = req.headers;
  const token = headers?.authorization?.split("Bearer")[1]?.trim();
  if (!token)
    throw new HttpError(
      errorPleaseProvideAccessToken,
      HTTP_STATUS_CODE.unauthorized,
    );
  let userData: any = CryptoService.decryptText(token);
  if (!userData)
    throw new HttpError(
      errorPleaseProvideAccessToken,
      HTTP_STATUS_CODE.unauthorized,
    );
  userData = JSON.parse(userData);
  if (!userData?.userId || !userData?.otp)
    throw new HttpError(
      errorPleaseProvideAccessToken,
      HTTP_STATUS_CODE.unauthorized,
    );
  const expireTime = userData.expireTime;
  const currentTime = new Date().getTime();
  if (currentTime >= expireTime)
    throw new HttpError(errorTokenExpire, HTTP_STATUS_CODE.unauthorized);
  req.body.userId = userData.userId;
  req.body.otp = userData.otp;
  req.body.token = token;
  next();
}
//#endregion

//#region user authentication
export async function userAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const headers = req.headers;
  const token = headers?.authorization?.split("Bearer")[1]?.trim();
  if (!token)
    throw new HttpError(
      errorPleaseProvideAccessToken,
      HTTP_STATUS_CODE.unauthorized,
    );
  const is_verified: any = await CryptoService.verifyJWTToken(token);
  if (!is_verified || !is_verified?.userId)
    throw new HttpError(
      errorPleaseProvideAccessToken,
      HTTP_STATUS_CODE.unauthorized,
    );
  const userId = is_verified?.userId;
  const checkUser = await userService.checkUserExists({ token }, true);
  if (!checkUser)
    throw new HttpError(
      errorPleaseProvideAccessToken,
      HTTP_STATUS_CODE.unauthorized,
    );
  req.body.userId = userId;
  req.query.userId = userId;
  next();
}
