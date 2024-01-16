import { Types } from "mongoose"
import { UserResumeModel } from "../models/user.resume.model"
import { HttpError } from "../common/error.service"
import { errorRecordNotCreated, errorRecordNotUpdated } from "../common/string"
import { ACTIVE, HTTP_STATUS_CODE, ModelName, PRE_DEFINED_ALLOWED_VALUES, RESUME_STEP, SUMMARY_ABT, customValidationDataTypes, is_array, is_optional } from "../common/constant"
import { PipelineStage } from "mongoose"
import { DataTypeModel } from "../models/data.types.model"
import { GetResumeList } from "../validations/resume.validation"
import { prepareLookUp, unwindArr } from "../helper.services.ts/database.service"
import { ResumeSchemaModel } from "../models/resume.schema.model."
import { fileHelperService } from "../helper.services.ts/file.service.helper"

export const userResumeService = new class {


    //#region create new user resume
    async createUserResume(data: any) {
        return await new UserResumeModel(data).save()
    }
    //#endregion

    //#region create new  resume schema
    async createResumeSchema(data: any) {
        return await new ResumeSchemaModel(data).save()
    }
    //#endregion

    //#region create new  resume schema
    async getTotalResumeSchemaCount() {
        return await ResumeSchemaModel.countDocuments().exec();
    }
    //#endregion

    //#region  update user resume 
    async updateUserResume(filter: any, updateData: any, arrayFilters: any = []) {
        if (Object.keys(updateData).length == 0) return {}
        return await UserResumeModel.findOneAndUpdate(filter,
            updateData,
            {
                arrayFilters,
                returnDocument: "after"
            })
    }
    //#endregion

    //#region  update resume schema 
    async updateResumeSchema(filter: any, updateData: any) {
        return await ResumeSchemaModel.findOneAndUpdate(filter, updateData, { returnDocument: "after" })
    }
    //#endregion

    //#region  update resume schema 
    async updateSchemas(filter: any, updateData: any) {
        const update: any = await ResumeSchemaModel.updateMany(filter, updateData)
        if (update.acknowledged && update.modifiedCount > 0) return true
        else return false

    }
    //#endregion

    //#region  findData
    async getResumeData({ filter, attributes = [], projection = {}, sort = {} }:
        { filter: any; attributes?: [] | string[]; projection?: any, sort: any }) {
        return await UserResumeModel.findOne(filter, projection).select(attributes).sort(sort)
    }
    //#endregion

    //#region  findData
    async getResumeSchemaData(filter: any, attributes: any = [], projection: any = {}, sort: any = {}) {
        return await ResumeSchemaModel.find(filter, projection).select(attributes).sort(sort)
    }
    //#endregion

    //#region  findData
    async getResumeSchema(filter: any, attributes: any = [], projection: any = {}, sort: any = {}) {
        return await ResumeSchemaModel.findOne(filter, projection).select(attributes).sort(sort)
    }
    //#endregion



    //#region check step and create 
    async createORAddStepData(step: String, data: any,
        resumeId: any = null,
        userId: Types.ObjectId | null = null, sectionData: any) {
        let newData
        if (!Array.isArray(data)) {
            data._id = new Types.ObjectId()
            data.is_active = ACTIVE
        }
        if (sectionData.order == 1) {
            const createData = {
                steps: [{
                    step,
                    data: [{ _id: new Types.ObjectId(), ...data }],
                }],
                userId,
                currentStep: step

            }
            newData = await userResumeService.createUserResume(createData)
            if (!newData) throw new HttpError(errorRecordNotCreated)
        } else {
            const query =
                [
                    {
                        $unwind: '$steps'
                    }, {
                        $match: {
                            "_id": new Types.ObjectId(resumeId),
                            'steps.step': step
                        }
                    },
                    {
                        $limit: 1
                    }
                ]
            let filter: any = {}
            let updateData: any = {}
            //get resume aggregate 
            const checkData = await this.getResumeAggregate(query)
            //check result data
            filter["_id"] = new Types.ObjectId(resumeId)
            if (checkData) {
                filter['steps.step'] = step
                updateData =
                {
                    $push: {
                        'steps.$.data': data
                    }
                }
            } else {
                updateData = {
                    $push: {
                        steps: {
                            step,
                            data: Array.isArray(data) ? data : [data]
                        }
                    },
                    currentStep: step


                }
            }

            //update data
            newData = await userResumeService.updateUserResume(filter, updateData)

            if (!newData) throw new HttpError(errorRecordNotUpdated)
        }
        return await this.checkUsercurrentStep(newData)
    }
    //#endregion

    //#region get single aggregation data
    async getResumeAggregate(options: PipelineStage[], isAll = false) {
        const result: any = await UserResumeModel.aggregate(options).exec()
        return isAll ? result : result[0] ? result[0] : null
    }
    //#endregion

    //#region get resume schema
    async getResumeSchemaAggregate(options: PipelineStage[], isAll = false) {
        const result: any = await ResumeSchemaModel.aggregate(options).exec()
        return isAll ? result : result[0] ? result[0] : null
    }
    //#endregion


    //#region  check user resume current step
    async checkUsercurrentStep(resumeData: any) {

        let resumeId = resumeData?._id ?? resumeData.resumeId
        let download = resumeData?.download
        let preview = resumeData?.preview
        let finalResponse: any = {}
        if (resumeId) {
            resumeId = new Types.ObjectId(resumeId)


            const pipeline: any = [
                { $match: { "_id": resumeId } },
                {
                    $unwind: '$steps'
                },
                {
                    $unwind: '$steps.data'
                },
                {
                    $facet: {
                        jsonArray: [
                            // // Pipeline for handling array of JSON objects
                            {
                                $match: {
                                    // "steps.step": { $ne: "#MhHm3ou9T1" }
                                    'steps.data':
                                        { $type: "object" }
                                }
                            },
                            {
                                $lookup: {
                                    from: ModelName.counties,
                                    localField: 'steps.data.country',
                                    foreignField: 'code',
                                    as: 'steps.data.countries',
                                    pipeline: [{
                                        $project: {
                                            name: 1,
                                            code: 1
                                        }
                                    }]
                                }
                            },
                            {
                                $unwind: {
                                    path: '$steps.data.countries',
                                    preserveNullAndEmptyArrays: true
                                },
                            },
                            {
                                $lookup: {

                                    from: ModelName.states,
                                    let: { 'countryCode_': '$steps.data.countries.code' },
                                    localField: 'steps.data.state',
                                    foreignField: 'stateCode',
                                    as: 'steps.data.states',
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$countryCode', '$$countryCode_']
                                                }
                                            }
                                        },
                                        {
                                            $project: {
                                                name: 1,
                                                stateCode: 1,
                                                countryCode: 1
                                            }
                                        }]
                                }
                            },
                            //designation lookup
                            {
                                $lookup: {
                                    from: ModelName.designationModel,
                                    localField: 'steps.data.designationId',
                                    let: {
                                        summaryId: '$steps.data.designationSummaryId',
                                    },
                                    foreignField: '_id',
                                    as: 'steps.data.designationData',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: 1,
                                                summaries: 1
                                            },

                                        },
                                        {
                                            $addFields: {
                                                summaries: {
                                                    $first: {

                                                        $filter: {
                                                            input: "$summaries",
                                                            as: "summary",
                                                            cond: {
                                                                $eq: ["$$summary._id",
                                                                    "$$summaryId"]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                    ]
                                }
                            },
                            //education lookup
                            {
                                $lookup: {

                                    from: ModelName.educations,
                                    localField: 'steps.data.educationId',
                                    let: {
                                        summaryId: '$steps.data.educationSummaryId',
                                        performanceId: '$steps.data.educationPerformanceId'
                                    },
                                    foreignField: '_id',
                                    as: 'steps.data.educationData',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: 1,
                                                degreeType: 1,
                                                summaries: 1,
                                                performances: 1,

                                            }
                                        },

                                        {
                                            $addFields: {
                                                summaries: {
                                                    $first: {
                                                        $filter: {
                                                            input: "$summaries",
                                                            as: "summary",
                                                            cond: {
                                                                $eq: ["$$summary._id",
                                                                    "$$summaryId"]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            $addFields: {
                                                performances: {
                                                    $first: {
                                                        $filter: {
                                                            input: "$performances",
                                                            as: "performance",
                                                            cond: {
                                                                $eq: ["$$performance._id",
                                                                    "$$performanceId"]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            },


                            {
                                $lookup: {
                                    from: ModelName.designationModel,
                                    localField: 'steps.data.experienceId',
                                    let: {
                                        summaryId: '$steps.data.experienceSummaryId',
                                    },
                                    foreignField: '_id',
                                    as: 'steps.data.experienceData',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: 1,
                                                summaries: 1
                                            },

                                        },
                                        {
                                            $addFields: {
                                                summaries: {
                                                    $first: {

                                                        $filter: {
                                                            input: "$summaries",
                                                            as: "summary",
                                                            cond: {
                                                                $eq: ["$$summary._id",
                                                                    "$$summaryId"]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                    ]
                                }
                            },

                            {
                                $lookup: {

                                    from: ModelName.userModel,
                                    localField: 'userId',
                                    foreignField: '_id',
                                    as: 'userData',
                                    pipeline: [
                                        {
                                            $project: {
                                                first_name: 1,
                                                last_name: 1,
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                $unwind: {
                                    path: '$steps.data.states',
                                    preserveNullAndEmptyArrays: true
                                },

                            },
                            {
                                $unwind: {
                                    path: '$steps.data.designationData',
                                    preserveNullAndEmptyArrays: true
                                },
                            },
                            {
                                $unwind: {
                                    path: '$steps.data.educationData',
                                    preserveNullAndEmptyArrays: true
                                },
                            },

                            {
                                $unwind: {
                                    path: '$steps.data.experienceData',
                                    preserveNullAndEmptyArrays: true
                                },
                            },
                            {
                                $group: {
                                    _id: "$_id",
                                    steps: { $push: "$steps" },
                                    __v: { $first: "$__v" }
                                },
                            },
                            {
                                $unwind: '$steps'
                            },
                        ],
                        simpleArray: [
                            // Pipeline for handling simple array elements
                            {
                                $match: {
                                    'steps.data': { $type: 'string' }
                                }
                            },
                            {
                                $group: {
                                    _id: "$_id",
                                    steps: { $push: "$steps" },
                                    __v: { $first: "$__v" }
                                },
                            },
                            {
                                $unwind: '$steps'
                            },
                        ]

                    }

                },
                {
                    $project: {
                        mergedArray: {
                            $concatArrays: ["$simpleArray", "$jsonArray"]
                        }
                    }
                },

                {
                    $unwind: {
                        path: '$mergedArray',
                        preserveNullAndEmptyArrays: true
                    },
                },

                {
                    $group: {
                        _id: "$mergedArray._id",
                        steps: { $push: '$mergedArray.steps' },
                        __v: { $first: '$__v' }
                    }
                },

                {
                    $unwind: {
                        path: '$steps',
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $group: {
                        _id: {
                            _id: '$_id',
                            step: '$steps.step',
                            stepId: "$steps._id"
                        },
                        data: { $push: '$steps.data' },
                        __v: { $first: '$__v' }
                    }
                },
                {
                    $group: {
                        _id: '$_id._id',
                        steps: {
                            $push: {
                                _id: "$_id.stepId", step: '$_id.step', data: {
                                    $filter: {
                                        input: '$data', as: 'item', cond: {
                                            $or: [
                                                { $eq: [{ $type: "$$item" }, "string"] },
                                                { $eq: [{ $ifNull: ["$$item.is_active", true] }, true] }
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        __v: { $first: '$__v' }
                    }
                },

                // Add stages for combining the results or any additional processing
            ];

            // You can then use the results of each sub-pipeline as needed.

            finalResponse.previewData = await this.getResumeAggregate(pipeline)
        }
        if (preview == 'true' || download == "true") {
            finalResponse.previewData = await this.getResumeSchemaInfo(resumeId, finalResponse.previewData, true)
            let prefix = finalResponse.previewData.find((preview: any) => preview.slug == 'personal').data[0]?.full_name ?? ""
            prefix += "-" + finalResponse.previewData.find((preview: any) => preview.slug == 'designation').data[0]?.designationData.name ?? ""


            finalResponse.fileContent = await this.previewPDFpreview(finalResponse.previewData)
            prefix += "-" + new Date().getTime() + ".pdf"
            if (download == "true") {
                let downloadData: any = await fileHelperService.generatePDF(finalResponse.fileContent, prefix)
                if (downloadData?.url)
                    await this.updateUserResume({ _id: resumeId }, { link: downloadData.url })
                finalResponse.url = downloadData.url
                delete finalResponse.fileContent
            }
            delete finalResponse.previewData
        }
        else
            finalResponse.currentStep = await this.getResumeSchemaInfo(resumeId, finalResponse.previewData)

        return finalResponse

    }
    //#endregion

    //#region  preview resume in pdf formate
    async previewPDFpreview(data: any) {
        return await fileHelperService.makeDynamicResumeObject(data)

    }

    //#region get data type
    async getDataType(filter: any, attributes: any[] = [], projection = {}) {
        return await DataTypeModel.findOne(filter, projection).select(attributes)
    }

    //#region create new user data type
    async createNewDataType(data: any) {
        return await new DataTypeModel(data).save()
    }
    //#endregion
    //#region  create data type allow value object
    createDataTypeAllowTypes(allowDataTypeValues: string[]) {
        const prepareObj: any = {}
        Object.keys(PRE_DEFINED_ALLOWED_VALUES).forEach(key => {
            if (allowDataTypeValues.includes(key)) prepareObj[key] = ACTIVE
        })
        return prepareObj
    }
    //#endregion

    //#region  get resume list
    async getResumeList(options: GetResumeList) {
        const search_text = options?.search_text
        const queryOptions: any = [{ $match: { is_active: ACTIVE } }]
        if (search_text)
            queryOptions.push({
                $match: { "steps.data.full_name": { $regex: search_text, $options: "i" } }
            })
        queryOptions.push({
            $unwind: '$steps'
        },
            {
                $unwind: '$steps.data'
            },
            prepareLookUp({
                from: ModelName.counties,
                localField: 'steps.data.country',
                foreignField: "code",
                as: "steps.data.country",
                pipeline: [{
                    $project: {
                        name: 1,
                        code: 1,
                        flag: 1
                    }
                }]
            }),
            unwindArr('$steps.data.country'),
            prepareLookUp({
                from: ModelName.states,
                let: { 'countryCode_': '$steps.data.country.code' },
                localField: 'steps.data.state',
                foreignField: 'stateCode',
                as: 'steps.data.state',
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$countryCode', '$$countryCode_']
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            stateCode: 1,
                            countryCode: 1
                        }
                    }]
            }),
            unwindArr('$steps.data.state'),
            //designation lookup
            prepareLookUp({
                from: ModelName.designationModel,
                localField: 'steps.data.designationId',
                let: {
                    summaryId: '$steps.data.designationSummaryId',
                    customSummary: "$steps.data.customSummary"
                },
                foreignField: '_id',
                as: 'steps.data.designationData',
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            summaries: 1,
                        },

                    },
                    {
                        $addFields: {
                            summaries: {
                                $cond: {
                                    if: {
                                        $ne: ['$$customSummary', null]
                                    },
                                    then: "$$customSummary",
                                    else: {
                                        $first: {
                                            $filter: {
                                                input: "$summaries",
                                                as: "summary",
                                                cond: {
                                                    $and: [
                                                        {
                                                            $eq: ["$$summary._id",
                                                                "$$summaryId"]
                                                        },

                                                    ]
                                                }
                                            }
                                        }
                                    }
                                },

                            }
                        }
                    }

                ]
            }),

            unwindArr('$steps.data.designationData'),

            { $project: { "steps.data": 1 } },
            {
                $group: {
                    _id: "$_id",
                    steps: { $push: "$steps" },
                    __v: { $first: "$__v" }
                },
            },
            {
                $unwind: '$steps'
            },
            {
                $unwind: '$steps.data'
            },

            {
                $group: {
                    _id: '$_id',
                    "full_name": { $first: "$steps.data.full_name" },
                    "email": { $first: "$steps.data.email" },
                    "mobileNo": { $first: "$steps.data.mobileNo" },
                    "country": { $first: "$steps.data.country.name" },
                    "countryFlag": { $first: "$steps.data.country.flag" },
                    "state": { $first: "$steps.data.state.name" },
                    "city": { $first: "$steps.data.city" },
                    "address": { $first: "$steps.data.address" },
                    "designations": { $push: "$steps.data.designationData" },
                },
            },


            { $sort: { "createdAt": 1 } }

        )


        return this.getResumeAggregate(queryOptions, true)

    }
    //#endregion

    //#region 
    async getResumeSchemaInfo(resumeId: Types.ObjectId, previewData: any, is_schema = false) {
        const match: any = { is_active: ACTIVE }
        let matchOrder = 1
        const schemaList = await this.getResumeSchemaAggregate([{ $match: match }], true)
        if (is_schema) {
            schemaList.map((schema: any) => {
                schema.data = previewData.steps.find((preview: any) => preview.step == schema.sectionID)?.data ?? []
                delete schema.fields
                return schema
            })
            return schemaList
        }
        if (resumeId) {
            const options: any = [
                { $match: { _id: resumeId } },

                {
                    $project: {
                        "_id": "$_id",
                        "currentStep": 1,
                    }
                }
            ]
            const resumeData = await this.getResumeAggregate(options)
            if (resumeData) {
                previewData.steps = previewData?.steps?.map((each: any) => {
                    each.slug = schemaList.find((schema: any) => schema.sectionID == each.step)?.slug
                    return each
                }
                )
                const foundNextOrder = schemaList.find((each: any) => each.sectionID == resumeData.currentStep)
                if (foundNextOrder) matchOrder = (foundNextOrder?.order ?? 0) + 1

            }
            // return resumeData
        }
        return schemaList.find((each: any) => each.order == matchOrder)

    }
    //#endregion

    //#region  check step wise validation
    async checkStepAndRequiredFields(payload: any, sectionID: String, is_all = true) {
        const options: any = [
            { $match: { sectionID: sectionID } },

            {
                $project: {
                    "_id": 1,
                    "fields": "$fields",
                    "sectionID": "$sectionID",
                    "order": 1
                }
            }
        ]
        const schemaData = await this.getResumeSchemaAggregate(options)
        if (!schemaData) throw new HttpError("Section not found")
        let modifiedObj: any = {}
        const fields = schemaData?.fields ?? []
        if (is_all)
            for (let i = 0; i < fields.length; i++) {
                const field: any = fields[i]
                const checkField: any = Object.keys(payload).find((pKey: any) => field.name == pKey)
                if (!checkField)

                    if (!field.dataTypes[is_optional]) throw new HttpError(`Require field missing :${field.name}`)
                    else continue
                const dataTypes = field.dataTypes
                if (dataTypes[is_array]) {
                    modifiedObj = payload[field.name].map((each: any) => {
                        customValidationDataTypes(dataTypes, each, field.name, each)
                        return each
                    })
                    break
                }
                const value: any = payload[checkField]

                customValidationDataTypes(dataTypes, value, checkField, payload)
                modifiedObj[checkField] = payload[checkField]
            }
        else {
            for (const key in payload) {
                const checkField: any = fields.find((field: any) => field.name == key)
                if (!checkField)
                    throw new HttpError(`${key}:not present in this section`)
                const dataTypes = checkField.dataTypes
                const value: any = payload[key]
                customValidationDataTypes(dataTypes, value, checkField.name, payload)
            }
        }
        return { schemaData, customPayload: modifiedObj }
    }
    //#endregion


}
