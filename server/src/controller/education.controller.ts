import { NextFunction, Request, Response } from "express";
import { AddEducation, EditOrDeleteEducation } from "../validations/education.validation";
import { HttpError, checkValidation } from "../common/error.service";
import { educationService } from "../service/education.service";
import { Success, errorRecordNotUpdated } from "../common/string";
import { ACTIVE, DE_ACTIVE, } from "../common/constant";

export class EducationController {
    constructor() { }


    //#region  add education details
    static async addEducationDetails(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const input: AddEducation = req.body
        const userInput = new AddEducation()
        userInput.degreeType = input?.degreeType?.toLowerCase()
        userInput.performance = input?.performance
        userInput.summary = input.summary
        userInput.userId = input.userId
        //check validation
        await checkValidation(userInput)

        //check education data already exist or not
        const checkOptions = { degreeType: userInput.degreeType }
        //education 
        const checkExist = await educationService.getEducation(checkOptions)
        const userId = input.userId
        const updateRecord: any = {}

        const performance: any = userInput?.performance
        const summary = { summary: userInput.summary, userId }
        //check existing data
        if (checkExist) {
            //performance
            const checkExistingPerformance = checkExist?.performances ?? []
            //check existing performance
            if (performance) {
                let is_found = checkExistingPerformance.find(each =>
                    each.label == performance?.label
                    && each.value == performance?.value)

                if (!is_found) updateRecord['$push'] = { performances: { ...(performance ?? {}), userId } }
            }
            if (userInput?.summary) updateRecord['$push'] = { summaries: summary }
            const update_options = { _id: checkExist._id }
            await educationService.updateEducation(update_options, updateRecord)
        } else {
            updateRecord.degreeType = userInput.degreeType
            performance.userId = userId
            updateRecord.performances = [performance]
            updateRecord.summaries = [summary]
            updateRecord.userId = userId
            await educationService.createNewEducation(updateRecord)
        }
        const responseData = {
            message: Success,
        }
        return res.json(responseData)
    }
    //#endregion

    //#region edit or delete education
    static async editOrDeleteEducation(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const input: EditOrDeleteEducation = req.body
        const userInput = new EditOrDeleteEducation()
        userInput.educationId = input.educationId
        userInput.degreeType = input?.degreeType?.toLowerCase()
        userInput.summaryId = input.summaryId
        userInput.summary = input.summary
        userInput.performanceId = input.performanceId
        userInput.performance = input.performance
        userInput.active = input.active
        userInput.userId = input.userId
        const is_enable = userInput.active == ACTIVE || userInput.active == DE_ACTIVE

        //check validation
        await checkValidation(userInput)
        const updateData: any = {}
        const update_where: any = { _id: userInput.educationId }
        if (userInput.educationId
            && !userInput?.summaryId
            && !userInput.performanceId) {
            if (is_enable) updateData.is_active = userInput.active
            else updateData.degreeType = userInput.degreeType
        }
        //summary update
        else if (userInput.summaryId) {
            update_where["summaries._id"] = userInput.summaryId
            updateData["$set"] = is_enable ?
                { "summaries.$.is_active": userInput.active } :
                { "summaries.$.summary": userInput.summary }
            //performance update
        } else if (userInput.performanceId) {
            update_where["performances._id"] = userInput.performanceId
            updateData["$set"] = is_enable ?
                { "performances.$.is_active": userInput.active } :
                {
                    "performances.$.label": userInput.performance.label,
                    "performances.$.value": userInput.performance.value
                }
        }
        //update data
        const is_update = await educationService.updateEducation(update_where, updateData)
        if (!is_update) throw new HttpError(errorRecordNotUpdated)

        return res.json({ message: Success })
    }
    //#endregion

    //#region  get education details
    static async getEducationDetails(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const input = req.query
        const educationId = input.educationId
        const filter: any = { is_active: ACTIVE }
        const attributes = ['_id', 'summaries', 'performances', 'degreeType', 'is_active']
        let list: any = []
        if (educationId) {
            filter._id = educationId
            list = await educationService.getEducation(filter, attributes)
        } else
            list = await educationService.getAllEducation(filter, attributes)
        //response data
        const responseData = {
            message: Success,
            data: list
        }
        return res.json(responseData)
    }
    //#endregion


}