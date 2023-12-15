import {
    IsNotEmpty, IsString, IsIn, IsOptional, ValidateIf, IsBoolean

} from 'class-validator'
import { Transform } from 'class-transformer'
import { ACTIVE, DE_ACTIVE, PRE_DEFINE_DEGIGNATATION, SUMMARY_ABT, SUMMARY_EXP } from '../common/constant'
import { Types } from 'mongoose'


export class AddDesignationSummary {
    @IsIn(PRE_DEFINE_DEGIGNATATION)
    name!: string

    @IsNotEmpty()
    @IsString()
    summary!: string

    @IsIn([SUMMARY_EXP, SUMMARY_ABT])
    type!: string

    @IsNotEmpty()
    @IsString()
    userId!: string

}
export class CreateSkills {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => { value = value?.toLowerCase() })
    name!: string

    @IsNotEmpty()
    @IsString()
    userId!: string

}


export class EditDesignationAndSummary {
    @IsNotEmpty()
    @IsString()
    designationId!: Types.ObjectId

    @IsOptional()
    @IsString()
    summaryId!: string
    @ValidateIf((obj) => obj.active != ACTIVE && obj.active != DE_ACTIVE)
    @IsNotEmpty()
    @IsString()
    title!: string

    @IsNotEmpty()
    @IsString()
    userId!: string

    @ValidateIf((obj) => !obj.title)
    @IsBoolean()
    active!: boolean
}
