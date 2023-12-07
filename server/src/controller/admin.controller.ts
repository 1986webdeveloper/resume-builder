
import { Request, Response } from 'express'
import { AddDesignationSummary, EditDesignationAndSummary } from '../validations/admin.validation'
import { ACTIVE, DEACTIVE, HTTP_STATUS_CODE, PRE_DEFINE_DEGIGNATATION, SUMMARY_ABT, SUMMARY_EXP, SummaryType }
    from '../common/constant'
import { Success, errorDesignationIsNotValue, errorTypeIsInvalid, successDegignationCreated } from '../common/string'
import { HttpError, checkValidation } from '../common/error.service'
import { adminService } from '../service/admin.service'

//resume controller resume
export class AdminController {
    constructor() { }


    //#region  get degination list
    static designationList(req: Request, res: Response): Response {
        const responseData = {
            message: Success,
            data: PRE_DEFINE_DEGIGNATATION
        }
        return res.status(HTTP_STATUS_CODE.success).json(responseData)
    }
    //#endregion

    //#region  create user designation and summary
    static async addDesignationSummary(req: Request, res: Response): Promise<Response> {
        const input: AddDesignationSummary = req.body
        const userInput = new AddDesignationSummary()
        userInput.name = input.name.toLowerCase()
        userInput.summary = input.summary
        userInput.type = input.type
        userInput.userId = input.userId
        //check validation
        await checkValidation(userInput);
        const newSummary: any = {
            summary: userInput.summary,
            userId: userInput.userId,
            type: userInput.type
        }
        //check designation exits or not
        const deg_options = { name: userInput.name }
        const exitDesignation = await adminService.getDesignationName(deg_options)
        if (exitDesignation)
            await adminService.addSummaryToDesignation(exitDesignation._id, newSummary)
        else {
            const payload = { name: userInput.name, summaries: [newSummary], userId: userInput.userId }
            await adminService.createNewDesignation(payload)
        }
        const responseData = {
            message: successDegignationCreated
        }
        return res.status(HTTP_STATUS_CODE.create_success).json(responseData)
    }
    //#endregion

    //#region update designation and summary
    static async editDesignationOrSummary(req: Request, res: Response): Promise<Response> {
        const input: EditDesignationAndSummary = req.body
        const userInput = new EditDesignationAndSummary()
        userInput.title = input?.title?.toLowerCase()
        userInput.designationId = input?.designationId
        userInput.summaryId = input?.summaryId
        userInput.userId = input?.userId
        userInput.active = input.active
        //check validation
        await checkValidation(userInput);
        //check is delete or active task
        const is_enable = userInput.active == ACTIVE || userInput.active == DEACTIVE
        const update_where: any = { _id: userInput.designationId, is_active: ACTIVE }
        const updateData: any = {}
        //check update summary or designation title
        if (userInput.summaryId) {
            update_where["summaries._id"] = userInput.summaryId
            if (is_enable)
                updateData["$set"] = { "summaries.$.is_active": userInput.active }
            else updateData["$set"] = { "summaries.$.summary": userInput.title }

        } else {
            if (userInput?.title && !PRE_DEFINE_DEGIGNATATION.includes(userInput.title))
                throw new HttpError(errorDesignationIsNotValue,
                    HTTP_STATUS_CODE.bad_request)
            if (is_enable) updateData.is_active = userInput.active
            else updateData.name = userInput.title
        }
        //update designation
        await adminService.updateDesignation(update_where, updateData)
        const responseData = {
            message: Success
        }
        return res.status(HTTP_STATUS_CODE.success).json(responseData)

    }
    //#endregion

    //#region  get designation list with summary
    static async getDesignationList(req: Request, res: Response): Promise<Response> {
        const userInput = req.query
        let list_data: any = []
        if (userInput.designationId) {
            const type = userInput?.type?.toString() ?? ""
            if (![SUMMARY_ABT, SUMMARY_EXP].includes(type)) throw new HttpError(errorTypeIsInvalid)

            list_data = await adminService.summaryList(userInput.designationId, type)
        }
        else
            list_data = await adminService.designationList()
        const responseData = {
            message: Success,
            data: list_data
        }
        return res.status(HTTP_STATUS_CODE.success).json(responseData)
    }
    //#endregion

    //#region delete designation or summary

    static async activeDeactiveDesignation(req: Request, res: Response): Promise<Response> {
        const input: EditDesignationAndSummary = req.body
        const userInput = new EditDesignationAndSummary()
        userInput.designationId = input?.designationId
        userInput.summaryId = input?.summaryId
        userInput.userId = input?.userId
        //check validation
        await checkValidation(userInput);
        const update_where: any = { _id: userInput.designationId, is_active: ACTIVE }
        const updateData: any = {}
        //check update summary or designation title
        if (userInput.summaryId) {
            update_where["summaries._id"] = userInput.summaryId
            updateData["$set"] = { "summaries.$.summary": userInput.title }

        } else {
            if (!PRE_DEFINE_DEGIGNATATION.includes(userInput.title))
                throw new HttpError(errorDesignationIsNotValue,
                    HTTP_STATUS_CODE.bad_request)
            updateData.name = userInput.title
        }
        //update designation
        await adminService.updateDesignation(update_where, updateData)
        const responseData = {
            message: Success
        }
        return res.status(HTTP_STATUS_CODE.success).json(responseData)

    }
    //#endregion
}