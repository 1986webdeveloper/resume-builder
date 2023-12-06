import {
    IsNotEmpty, IsString, IsEmail,
    IsOptional, ValidateNested, IsArray,
    ValidateIf, IsMobilePhone, IsIn

} from 'class-validator'
import { Transform } from 'class-transformer'
export class CreateSkills {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => { value = value?.toLowerCase() })
    name!: string

    @IsNotEmpty()
    @IsString()
    userId!: string

}