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
export const ModelName = {
  userModel: "users",
  designationModel: "designations",
  skills: "skills",
  educations: "educations",
  counties: "countries",
  states: "states",
  cities: "cities",
  userResume: "userresumes",
  dataTypes: "datatypes"
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
//pre define allowed value
export const PRE_DEFINED_ALLOWED_VALUES = {
  allowedOnly: DE_ACTIVE,
  is_range: DE_ACTIVE,
  boolean: DE_ACTIVE,
  formate: DE_ACTIVE,
  is_date: DE_ACTIVE,
  is_number: DE_ACTIVE,
  is_string: DE_ACTIVE,
  is_array: DE_ACTIVE
}