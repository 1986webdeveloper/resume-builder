import { HttpError } from "../common/error.service";
import { errorRecordNotCreated } from "../common/string";
import { EducationModel } from "../models/education.model";


//education service
export const educationService = new class {
    constructor() { }

    //#region get education data
    async getEducation(options: any, attributes: [] | string[] = []) {
        return EducationModel.findOne(options)
            .select(['_id', 'degreeType', 'performances', 'summaries', ...attributes])
    }
    //#endregion

    //#region  create new education
    async createNewEducation(data: any) {
        const newRecord = await new EducationModel(data).save()
        if (!newRecord) throw new HttpError(errorRecordNotCreated)
        return newRecord
    }
    //#endregion

    //#region update education data
    async updateEducation(update_where: any, updateData: any) {
        if (Object.keys(updateData).length == 0) return false
        const update = await EducationModel.updateOne(update_where, updateData)
        if (update.acknowledged && update.modifiedCount > 0) return true
        else return false
    }
    //#endregion

    //#region  get all education

    async getAllEducation(options: any, attributes: [] | string[] = []) {
        return EducationModel.find(options)
            .select(attributes)
    }
    //#endregion
}