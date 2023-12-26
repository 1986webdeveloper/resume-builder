
import { Request, Response } from 'express'
import { ChangeOrderSchema, CreateDataTypes, CreateResumeSchema, EditOrDeleteResume, EditOrDeleteResumeSchema, GetResumeList, UserResumeMaster } from '../validations/resume.validation'
import { HttpError, checkValidation } from '../common/error.service'
import { userResumeService } from '../service/resume.service'
import {
    Success,
    errorDataTypeAlreadyExist,
    errorFieldAlreadyExists,
    errorRecordNotCreated,
    errorResumeNotFound
} from '../common/string'
import { ACTIVE, DE_ACTIVE, HTTP_STATUS_CODE } from '../common/constant'
import { Types } from 'mongoose'
import { generateRandomId } from '../common/common'
import { unwindArr } from '../helper.services.ts/database.service'

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
        const validation = await userResumeService.checkStepAndRequiredFields(userInput.data, step)
        const sectionData = validation.schemaData
        let data: any = validation.customPayload
        const responseData = await userResumeService.createORAddStepData(step, data, userInput.resumeId, userInput.userId, sectionData)
        return res.status(HTTP_STATUS_CODE.create_success).json({ message: Success, data: responseData })
    }
    //#endregion



    //#region  get resume information
    static async getResumeInfo(req: Request, res: Response): Promise<Response> {
        const userInput: any = req.query
        // check validation
        const resumeInfo: any = await userResumeService.checkUsercurrentStep({
            _id: userInput.resumeId,
            download: userInput.download
        })
        return res.json({ message: Success, data: resumeInfo })
    }
    //#endregion

    //#region  get all resume list
    static async getAllResumeList(req: Request, res: Response): Promise<Response> {
        const input: GetResumeList | any = req.query
        const userInput = new GetResumeList()
        userInput.search_text = input.search_text
        userInput.userId = input.userId
        //check validation
        await checkValidation(userInput)
        const result = await userResumeService.getResumeList(userInput)
        const responseData = {
            message: Success,
            data: result
        }

        return res.json(responseData)
    }

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
        const input: CreateResumeSchema = req.body
        const userInput = new CreateResumeSchema()
        userInput.sectionId = input.sectionId
        userInput.title = input.title
        userInput.fieldName = input.fieldName
        userInput.dataTypes = input.dataTypes
        userInput.userId = input.userId
        //validate data
        await checkValidation(userInput)
        const filed = {
            name: userInput.fieldName,
            dataTypes: userResumeService.createDataTypeAllowTypes(userInput?.dataTypes ?? [])
        }
        let newData

        //check section if exists or not
        if (userInput.sectionId) {
            const query =
                [
                    {
                        $unwind: '$fields'
                    },
                    {
                        $match: {
                            "_id": new Types.ObjectId(userInput.sectionId),
                            'fields.name': userInput.fieldName
                        }
                    },
                    {
                        $limit: 1
                    }
                ]
            const checkFiledExits = await userResumeService.getResumeSchemaAggregate(query)
            if (checkFiledExits) throw new HttpError(errorFieldAlreadyExists, HTTP_STATUS_CODE.found)

            const updateData = {
                $push: {
                    fields: filed
                }
            }
            const filter = { _id: new Types.ObjectId(userInput.sectionId) }
            newData = await userResumeService.updateResumeSchema(filter, updateData)

        } else { //create new section
            const totalDocument = await userResumeService.getTotalResumeSchemaCount()
            const createPayload: any = {
                sectionID: generateRandomId(),
                title: userInput.title,
                slug: userInput.title.split(" ")[0],
                order: (totalDocument ?? 0) + 1,
                userId: userInput.userId

            }
            if (userInput.fieldName) {
                createPayload.fields = [filed]
            }
            newData = await userResumeService.createResumeSchema(createPayload)

        }
        const responseData = { message: Success, data: newData }
        return res.json(responseData)
    }

    //#endregion

    //#region edit or delete resume schema
    static async editOrDeleteResumeSchema(req: Request, res: Response): Promise<Response> {
        const input: EditOrDeleteResumeSchema = req.body
        const userInput = new EditOrDeleteResumeSchema()
        userInput.active = input.active
        userInput.dataTypes = input.dataTypes
        userInput.fieldId = input.fieldId
        userInput.fieldName = input.fieldName
        userInput.sectionTitle = input.sectionTitle
        userInput.schemaId = input.schemaId
        userInput.userId = input.userId
        //check validation
        await checkValidation(userInput)
        const is_active_delete = userInput.active == ACTIVE || userInput.active == DE_ACTIVE
        const update: any = {}
        const filter: any = { _id: userInput.schemaId }
        if (userInput.sectionTitle) {
            update.title = userInput.sectionTitle
            update.slug = userInput?.sectionTitle?.split(" ")[0]
        }
        else if (userInput.fieldId) {
            filter["fields._id"] = userInput.fieldId
            if (userInput.fieldName)
                update["$set"] = { "fields.$.name": userInput.fieldName }
            else if (userInput.dataTypes.length > 0) {
                update['$set'] = {
                    "fields.$.dataTypes":
                        userResumeService.createDataTypeAllowTypes(userInput?.dataTypes ?? [])
                }
            }
            else if (is_active_delete)
                update["$set"] = { "fields.$.is_active": userInput.active }
        }
        else if (is_active_delete)
            update.is_active = userInput.active
        const updateRecord = await userResumeService.updateResumeSchema(filter, update)
        if (updateRecord && is_active_delete && !userInput?.fieldId) {
            const updateOrder: any = {}
            const filterOrder = { _id: { $ne: userInput.schemaId }, is_active: ACTIVE }

            if (userInput.active == ACTIVE)
                updateOrder["$inc"] = { order: 1 }
            else updateOrder["$inc"] = { order: -1 }
            await userResumeService.updateSchemas(filterOrder, updateOrder)
        }
        const responseData = { message: Success, data: updateRecord }
        return res.json(responseData)

    }
    //#endregion

    //#region  change to order
    static async changeSectionOrder(req: Request, res: Response): Promise<Response> {
        const input: ChangeOrderSchema = req.body
        const userInput = new ChangeOrderSchema()
        userInput.order = input.order
        userInput.schemaId = input.schemaId
        //check validation
        await checkValidation(userInput)
        const filter: any = { _id: userInput.schemaId }
        const updateOrder = { order: userInput.order }
        const updateRecord = await userResumeService.updateResumeSchema(filter, updateOrder)
        if (updateRecord) {
            const filter = {
                order: { $gte: userInput.order },
                is_active: ACTIVE,
                _id: { $ne: userInput.schemaId }
            }
            const updateOrder = { "$inc": { order: 1 } }
            await userResumeService.updateSchemas(filter, updateOrder)
        }


        return res.json()
    }
    //#endregion

    //#region  edit resume section
    static async editOrDeleteUserResume(req: Request, res: Response): Promise<Response> {
        const input: EditOrDeleteResume = req.body
        const userInput = new EditOrDeleteResume()
        userInput.elementId = input.elementId
        userInput.data = input.data
        userInput.resumeId = input.resumeId
        userInput.sectionId = input.sectionId
        userInput.active = input.active
        //check validation proper
        await checkValidation(userInput)
        const is_active_delete = userInput.active == ACTIVE || userInput.active == DE_ACTIVE
        const is_update_data = Object.keys((userInput?.data ?? {})).length > 0
        userInput.resumeId = new Types.ObjectId(userInput.resumeId)
        const filter: any = [{ $match: { _id: userInput.resumeId } }]
        if (userInput.sectionId) {
            userInput.sectionId = new Types.ObjectId(userInput.sectionId)
            filter.push(unwindArr("$steps"))
            filter.push({ $match: { "steps._id": userInput.sectionId } })
        }
        if (userInput.elementId) {
            userInput.elementId = new Types.ObjectId(userInput.elementId)
            filter.push(unwindArr("$steps.data"))
            filter.push({ $match: { "steps.data._id": userInput.elementId } })
        }
        //check resume data
        const checkData = await userResumeService.getResumeAggregate(filter)
        if (!checkData) throw new HttpError(errorResumeNotFound, HTTP_STATUS_CODE.not_found)
        const updateData: any = {}
        const update_filter: any = { _id: userInput.resumeId }
        const arrayFilters = []
        if (userInput.sectionId) {
            arrayFilters.push({ 'section._id': userInput.sectionId })
            update_filter["steps"] = {
                $elemMatch: { _id: userInput.sectionId },
            }
            if (userInput.elementId) {
                arrayFilters.push({ 'element._id': userInput.elementId })
                update_filter["steps.data"] = {
                    $elemMatch: { _id: userInput.elementId }
                }
                if (is_update_data) {
                    //check update fields
                    await userResumeService.checkStepAndRequiredFields(userInput.data, checkData.steps.step, false)
                    for (let key in userInput.data) {
                        updateData[`steps.$[section].data.$[element].${key}`] = userInput.data[key]
                    }
                }
            } else if (is_active_delete)
                updateData["$set"] = { "steps.$[section].is_active": userInput.active }
        }
        const update = await userResumeService.updateUserResume(update_filter, updateData, arrayFilters)
        const responseData = { message: Success, data: update }
        return res.json(responseData)

    }
    //#endregion

}