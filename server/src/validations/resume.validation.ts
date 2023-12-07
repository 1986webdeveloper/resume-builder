// import {
//     IsNotEmpty, IsString, IsEmail,
//     IsOptional, ValidateNested, IsArray,
//     ValidateIf, IsMobilePhone, IsIn

// } from 'class-validator'
// import { Type } from 'class-transformer';

// class Link {
//     @IsString()
//     title!: string
//     @IsString()
//     link!: string
// }


// export class CreateUserBasicDeatail {

//     @IsIn(["BASIC", "OTHER"])
//     @IsString()
//     type!: string;
//     @ValidateIf((obj) => obj.type == 'BASIC')
//     @IsNotEmpty()
//     @IsString()
//     full_name!: string;

//     @ValidateIf((obj) => obj.type == 'BASIC')
//     @IsNotEmpty()
//     @IsEmail()
//     email!: string

//     @ValidateIf((obj) => obj.type == 'BASIC')
//     @IsNotEmpty()
//     @IsMobilePhone()
//     mobileNo!: string

//     @ValidateIf((obj) => obj.type == 'BASIC')
//     @IsNotEmpty()
//     @IsString()
//     dob!: string

//     @ValidateIf((obj) => obj?.dob)
//     @IsNotEmpty()
//     @IsString()
//     country!: string

//     @IsNotEmpty()
//     @IsString()
//     state!: string

//     @IsNotEmpty()
//     @IsString()
//     city!: string

//     @IsNotEmpty()
//     @IsString()
//     post_code!: string

//     @IsNotEmpty()
//     @IsString()
//     address!: string

//     @IsOptional()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => Link)
//     links!: [{}]
// } 