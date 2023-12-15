
import { Request, Response } from 'express'
import { CreateDataTypes, GetResumeInfo, UserResumeMaster } from '../validations/resume.validation'
import { HttpError, checkValidation } from '../common/error.service'
import { userResumeService } from '../service/resume.service'
import { Success, errorDataTypeAlreadyExist, errorRecordNotCreated, errorResumeNotFound } from '../common/string'
import { HTTP_STATUS_CODE } from '../common/constant'
import { Types } from 'mongoose'

//resume controller resume
export class ResumeController {
    constructor() { }

    //#region  create user basic details
    static async createUserBasicDetails(req: Request, res: Response): Promise<Response> {
        const input: UserResumeMaster = req.body
        const userInput = new UserResumeMaster()
        userInput.step = input.step
        userInput.data = input.data
        userInput.userId = input.userId
        userInput.resumeId = new Types.ObjectId(input.resumeId)
        //check validation
        await checkValidation(userInput)
        let step = userInput.step
        let data: any = userInput?.data
        const responseData = await userResumeService.createORAddStepData(step, data, userInput.resumeId, userInput.userId)
        return res.status(HTTP_STATUS_CODE.create_success).json({ message: Success, data: responseData })
    }
    //#endregion



    //#region  get resume information
    static async getResumeInfo(req: Request, res: Response): Promise<Response> {
        const input: GetResumeInfo = req.body
        const userInput = new GetResumeInfo()
        userInput.resumeId = input.resumeId
        userInput.userId = input.userId
        // check validation
        await checkValidation(userInput)
        const resumeInfo: any = await userResumeService.checkUsercurrentStep({ _id: userInput.resumeId })
        return res.status(HTTP_STATUS_CODE.create_success).json({ message: Success, data: resumeInfo })
    }
    //#endregion

    //#region  create data type
    static async createDataTypes(req: Request, res: Response): Promise<Response> {
        const input: CreateDataTypes = req.body
        const userInput = new CreateDataTypes()
        userInput.title = input?.title?.toLowerCase()?.trim()
        userInput.allowedValueTypes = input.allowedValueTypes
        userInput.userId = input.userId
        // check validation
        await checkValidation(userInput)
        const typesObj = userResumeService.createDataTypeAllowTypes(userInput.allowedValueTypes)
        const filter: any = { title: userInput.title }
        const checkExits = await userResumeService.getDataType(filter, ['_id'])
        if (checkExits) throw new HttpError(errorDataTypeAlreadyExist, HTTP_STATUS_CODE.found)
        filter.allowedValueTypes = typesObj
        filter.userId = userInput.userId
        const newDatatype = await userResumeService.createNewDataType(filter)
        if (!newDatatype) throw new HttpError(errorRecordNotCreated)
        const responseData = { message: Success, data: newDatatype }
        return res.status(HTTP_STATUS_CODE.create_success).json(responseData)
    }
    //#endregion

    //#region create resume structure
    static async createResumeSchema(req: Request, res: Response): Promise<Response> {
        const input = req.body
        const userInput = new GetResumeInfo()
        return res.json()
    }

    //#endregion

}