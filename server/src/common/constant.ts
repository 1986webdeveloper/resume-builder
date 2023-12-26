import { Types } from "mongoose";
import { HttpError } from "./error.service";

export const HTTP_STATUS_CODE = {
  not_found: 404,
  found: 403,
  unauthorized: 401,
  bad_request: 400,
  success: 200,
  create_success: 201,
  internal_error: 500,
};

// database models
export const ModelName: any = {
  userModel: "users",
  designationModel: "designations",
  skills: "skills",
  educations: "educations",
  counties: "countries",
  states: "states",
  cities: "cities",
  userResume: "userresumes",
  dataTypes: "datatypes",
  resumeSchema: "resumeschema"
};
//#endregion

//Token expire time

export const TOKEN_EXPIRE_MIN = 15;
export const LOGIN_TOKEN_EXPIRE = 24
export const TOTAL_PASSWORD_ATTEMPS = 3
export const COOL_OFF_MIN = 15
//node env
export const IS_DEV =
  process.env.NODE_ENV != "uat" && process.env.NODE_ENV != "prod";
export const IS_UAT = process.env.NODE_ENV == "uat";
export const IS_PROD = process.env.NODE_ENV == "prod";

export const ACTIVE = true
export const DE_ACTIVE = false

export const PRE_DEFINE_DEGIGNATATION = ["frontend", "backend", "qa", "devops", 'data analyst', "data engineer"]

//summary type
export const SUMMARY_EXP = 'EXPERIENCE'
export const SUMMARY_ABT = 'ABOUT'
export enum SummaryType {
  ABOUT = SUMMARY_ABT,
  EXPERIENCE = SUMMARY_EXP
}

export const RESUME_STEP = {
  personal: "PERSONAL",
  designation: "DESIGNATION",
  experience: "EXPERIENCE",
  education: "EDUCATION",
  skill: "SKILL",
  preview: "PREVIEW"

}
export let allowedOnly = 'allowedOnly'
export let is_range = 'is_range'
export let boolean = 'boolean'
export let formate = 'formate'
export let is_date = 'is_date'
export let is_number = "is_number"
export let is_string = "is_string"
export let is_array = "is_array"
export let is_object_id = "is_object_id"
export let is_optional = "is_optional"
export let is_object = 'is_object'

//pre define allowed value
export const PRE_DEFINED_ALLOWED_VALUES = {
  [allowedOnly]: "##FIELD## allowed from specific list only.",
  [is_range]: "##FIELD## should be in range",
  [boolean]: "##FIELD## should only be 'true' or 'false'.",
  [formate]: "##FIELD## Formate not specified.",
  [is_date]: "##FIELD## should be date formate",
  [is_number]: "##FIELD## should be number.",
  [is_string]: "##FIELD## should be string.",
  [is_array]: "##FIELD## should be in array formate.",
  [is_object_id]: "##FIELD## should be in object id formate.",
  [is_optional]: "",
  [is_object]: "##FIELD## should be in object formate."
}


export const customValidationDataTypes = (type: any, value: any, filedName: string, payload: any) => {
  let errorKey
  for (let dKey in type) {
    if (!value && !type[is_optional]) {
      const message = PRE_DEFINED_ALLOWED_VALUES[dKey] || "Require field missing"
      if (message) throw new HttpError(message, HTTP_STATUS_CODE.bad_request)
    }

    else if (type[is_optional] && !value) continue
    else if (dKey == is_string && typeof value != "string") errorKey = dKey
    else if (dKey == is_number && typeof value != "number") errorKey = dKey
    else if (dKey == boolean && typeof value != 'boolean') errorKey = dKey
    else if (dKey == is_date && typeof value != "string") errorKey = dKey
    else if (dKey == is_object_id && typeof value == 'string') payload[filedName] = new Types.ObjectId(value)
    else if (dKey == is_object && typeof value != 'object') errorKey = dKey

    if (errorKey) {
      const message = PRE_DEFINED_ALLOWED_VALUES[errorKey].replace("##FIELD##", filedName)
      throw new HttpError(message, HTTP_STATUS_CODE.bad_request)
    }

  }
}