import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from "class-validator"
import { Types } from "mongoose"
import { ACTIVE, DEACTIVE } from "../common/constant"

export class AddSkills {
    @IsNotEmpty()
    @IsString()
    name!: string


    @IsNotEmpty()
    @IsString()
    userId!: string
}

export class EditOrDeleteSkills {
    @IsNotEmpty()
    @IsString()
    skillId!: Types.ObjectId


    @ValidateIf((obj) => obj.active != ACTIVE && obj.active != DEACTIVE)
    @IsNotEmpty()
    @IsString()
    name!: string

    @IsNotEmpty()
    @IsString()
    userId!: string

    @ValidateIf((obj) => !obj.name)
    @IsBoolean()
    active!: boolean
}