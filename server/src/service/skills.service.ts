import { HttpError } from "../common/error.service"
import { errorRecordNotCreated } from "../common/string"
import { SkillsModel } from "../models/skills.model"

export const skillsService = new class {
    constructor() { }
    //#region find one 
    async getSkill(options: any, attributes: [] | [string] = []) {
        return await SkillsModel.findOne(options).select(['_id', 'name', ...attributes])
    }
    //#endregion

    //#region  new skills
    async createNewSkill(data: any) {
        const newRecord = await new SkillsModel(data).save()
        if (!newRecord) throw new HttpError(errorRecordNotCreated)
        return newRecord
    }
    //#endregion

    //#region update skill 
    async updateSkill(option: any, updateData: any) {
        if (Object.keys(updateData).length == 0) return false
        const update = await SkillsModel.updateOne(option, updateData)
        if (update.acknowledged && update.modifiedCount > 0) return true
        else return false
    }
    //#endregion

    //#region  all skills data
    async getAllSkills(options: any, attributes: [] | [string] = []) {
        return await SkillsModel.find(options).select(['_id', 'name', ...attributes])
    }
    //#endregion
}
