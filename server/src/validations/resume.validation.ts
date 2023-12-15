import {
    IsNotEmpty, IsString, IsEmail,
    IsOptional, ValidateNested, IsArray,
    ValidateIf, IsMobilePhone, IsIn, IsObject, IsEnum, IsDate, IsBoolean, isIn, validate,

} from 'class-validator'
import { Types } from 'mongoose';
import { PRE_DEFINED_ALLOWED_VALUES, RESUME_STEP } from '../common/constant';
import { Transform } from 'class-transformer';

// class Link {
//     @IsString()
//     title!: string
//     @IsString()
//     link!: string
// }


export class PersonalDetails {


    @IsNotEmpty()
    @IsString()
    full_name!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string

    @ValidateIf((obj) => obj?.dob)
    @IsObject()
    country!: Types.ObjectId

    @IsNotEmpty()
    @IsString()
    state!: Types.ObjectId

    @IsNotEmpty()
    @IsString()
    city!: string

    @IsNotEmpty()
    @IsMobilePhone()
    mobileNo!: string

    @IsNotEmpty()
    @IsDate()
    dob!: Date

    @IsNotEmpty()
    @IsString()
    address!: string

    @Transform((value: any) => value ? new Types.ObjectId(value) : null)
    @IsNotEmpty()
    @IsObject()
    designationId!: Types.ObjectId

}

export class CommonValidation {
    @IsNotEmpty()
    @IsDate()
    startDate!: Date

    @IsOptional()
    @IsBoolean()
    present!: Boolean

    @ValidateIf(obj => obj?.present)
    @IsNotEmpty()
    @IsDate()
    endDate!: Types.ObjectId

    @IsOptional()
    @IsArray()
    addMore!: String[]
}

export class EducationDetails extends CommonValidation {
    @Transform((value: any) => value ? new Types.ObjectId(value) : null)
    @IsNotEmpty()
    @IsObject()
    educationId!: Types.ObjectId

    @Transform((value: any) => value ? new Types.ObjectId(value) : null)
    @IsNotEmpty()
    @IsObject()
    educationSummaryId!: Types.ObjectId

    @Transform((value: any) => value ? new Types.ObjectId(value) : null)
    @IsNotEmpty()
    @IsObject()
    educationPerformanceId!: Types.ObjectId

    @IsNotEmpty()
    @IsString()
    instituteName!: String;
}


export class ExperienceDetails extends CommonValidation {

    @Transform((value: any) => value ? new Types.ObjectId(value) : null)
    @IsNotEmpty()
    @IsObject()
    experienceId!: Types.ObjectId

    @Transform((value: any) => value ? new Types.ObjectId(value) : null)
    @IsNotEmpty()
    @IsObject()
    experienceSummaryId!: Types.ObjectId
    @IsNotEmpty()
    @IsString()
    companyName!: String;
}

export class Designation {
    @Transform((value: any) => value ? new Types.ObjectId(value) : null)
    @IsNotEmpty()
    @IsObject()
    designationId!: Types.ObjectId

    @Transform((value: any) => value ? new Types.ObjectId(value) : null)
    @IsNotEmpty()
    @IsObject()
    designationSummaryId!: Types.ObjectId
}

export class UserResumeMaster {
    @IsEnum(RESUME_STEP)
    step!: String

    @ValidateIf(obj => obj?.step != RESUME_STEP.personal && obj?.step)
    @Transform((value: any) => value ? new Types.ObjectId(value) : null)
    @IsNotEmpty()
    @IsString()
    resumeId!: Types.ObjectId

    @IsNotEmpty()
    data!: PersonalDetails | Designation | ExperienceDetails | EducationDetails | [Types.ObjectId]

    @Transform((value: any) => value ? new Types.ObjectId(value) : null)
    @IsNotEmpty()
    userId!: Types.ObjectId

}

export class GetResumeInfo {

    @IsNotEmpty()
    @IsString()
    resumeId!: Types.ObjectId

    @IsNotEmpty()
    userId!: Types.ObjectId
}
export class createResumeSchema {
    @IsNotEmpty()
    @IsString()
    stepTitle!: String

    @IsNotEmpty()
    label!: String


}

export class CreateDataTypes {
    @IsNotEmpty()
    @IsString()
    title!: String

    @IsIn(Object.keys(PRE_DEFINED_ALLOWED_VALUES))
    allowedValueTypes!: string[]


    @Transform((value: any) => value ? new Types.ObjectId(value) : null)
    @IsNotEmpty()
    userId!: Types.ObjectId
}