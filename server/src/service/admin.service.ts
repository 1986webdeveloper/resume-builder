import { Types } from "mongoose";
import { ACTIVE, SUMMARY_ABT } from "../common/constant";
import { HttpError } from "../common/error.service";
import { errorRecordNotCreated, errorSummaryNotAdded } from "../common/string";
import { UpdateSummary } from "../interface/admin.interface";
import { DesignationModel } from "../models/designation.model";



export const adminService = new class {
    constructor() { }


    //#region  create new degignation
    async createNewDesignation(data: any) {
        const newRecord = await new DesignationModel(data).save()
        if (!newRecord) throw new HttpError(errorRecordNotCreated)
        return newRecord
    }
    //#endregion

    //#region get degignation 
    async getDesignationName(option: any, otherAttr: any = []) {
        return DesignationModel.findOne(option).select(['_id', 'name', ...(otherAttr ?? [])])
    }
    //#endregion

    //#region update degignation 
    async updateDesignation(option: any, updateData: any) {
        if (Object.keys(updateData).length == 0) return false
        const update = await DesignationModel.updateOne(option, updateData)
        if (update.acknowledged && update.modifiedCount > 0) return true
        else return false
    }
    //#endregion

    //#region  list of designation
    async getAllDesignation(option: any, otherAttr: any = []) {
        return await DesignationModel.find(option).select(['_id', 'name', ...(otherAttr ?? [])])
    }

    //#region  common summary
    async addSummaryToDesignation(designation_id: Object, payload: UpdateSummary) {
        const updateData = { $push: { summaries: payload }, is_active: ACTIVE }
        const checkUpdateSummary = await this.updateDesignation({ _id: designation_id }, updateData)
        if (!checkUpdateSummary) throw new HttpError(errorSummaryNotAdded)
    }
    //#endregion

    //#region designation summary list
    async summaryList(designationId: any, type: string | undefined = SUMMARY_ABT) {
        const filter: any = [
            { $match: { _id: new Types.ObjectId(designationId), is_active: ACTIVE, 'summaries.type': type } },
            { $unwind: '$summaries' },
            { $match: { 'summaries.type': type, 'summaries.is_active': ACTIVE } },
            {
                $project: {
                    _id: '$summaries._id',
                    summary: '$summaries.summary',
                    is_active: '$summaries.is_active',
                    userId: '$summaries.userId',
                    type: '$summaries.type'
                }
            }
        ]
        const deg_list: any = await DesignationModel.aggregate(filter)
        return deg_list ?? []

    }
    //#endregion

    //#region designation list
    async designationList() {
        const filter = {
            is_active: ACTIVE,
        }
        //get all designation list
        const list = await this.getAllDesignation(filter)
        return (list ?? [])
    }
    //#endregion



}