import { Request, Response } from 'express'
import { AddSkills, EditOrDeleteSkills } from '../validations/skills.validation'
import { skillsService } from '../service/skills.service'
import { HttpError, checkValidation } from '../common/error.service'
import { Success, errorRecordNotUpdated, errorSkillsAlreadyExist } from '../common/string'
import { ACTIVE, DE_ACTIVE, HTTP_STATUS_CODE } from '../common/constant'
export class SkillsController {

    //#region  add skills
    static async addSkills(req: Request, res: Response): Promise<Response> {
        const input: AddSkills = req.body
        const userInput = new AddSkills()
        userInput.name = input?.name?.toLowerCase()
        userInput.userId = input.userId
        //check skill validation
        await checkValidation(userInput)
        //get skills and check already present or not
        const newData: any = { name: userInput.name }
        const existSkills = await skillsService.getSkill(newData)
        if (existSkills)
            throw new HttpError(errorSkillsAlreadyExist,
                HTTP_STATUS_CODE.bad_request)
        newData.userId = userInput.userId
        const newSkillAdd = await skillsService.createNewSkill(newData)
        const responseData = {
            message: Success,
            data: newSkillAdd
        }
        return res.status(HTTP_STATUS_CODE.create_success).json(responseData)
    }
    //#endregion

    //#region edit skills 
    static async editorDeleteSkills(req: Request, res: Response): Promise<Response> {
        const input: EditOrDeleteSkills = req.body
        const userInput = new EditOrDeleteSkills()
        userInput.skillId = input.skillId
        userInput.name = input.name
        userInput.userId = input.userId
        userInput.active = input.active
        //check validation
        await checkValidation(userInput)
        const updateData: any = {}
        if (userInput.name) {
            updateData.name = userInput.name.toLowerCase()
            const existSkills = await skillsService.getSkill(updateData)
            if (existSkills)
                throw new HttpError(errorSkillsAlreadyExist,
                    HTTP_STATUS_CODE.bad_request)
        }
        else if (userInput.active == ACTIVE || userInput.active == DE_ACTIVE)
            updateData.is_active = userInput.active
        const update_where = { _id: userInput.skillId }
        const is_update = await skillsService.updateSkill(update_where, updateData)
        if (!is_update) throw new HttpError(errorRecordNotUpdated)
        const responseData = { message: Success }
        return res.status(HTTP_STATUS_CODE.success).json(responseData)
    }
    //#endregion

    //#region  get all skills list
    static async getAllSkills(req: Request, res: Response): Promise<Response> {
        const userInput = req.query
        const filter: any = { is_active: ACTIVE }
        if (userInput.searchText)
            filter['name'] = { '$regex': userInput.searchText }
        const list = await skillsService.getAllSkills(filter)
        const responseData = { message: Success, data: list }
        return res.json(responseData)
    }
    //#endregion

}