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
    async testGetResumeData(filter: any) {
        return await UserResumeModel.findOne(filter).lean()
    }
    //#endregion


    //#region check step and create 
    async createORAddStepData(step: String, data: any,
        resumeId: any = null,
        userId: Types.ObjectId | null = null, sectionData: any) {
        let newData
        if (data?.length) data._id = new Types.ObjectId()
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
                            data: step == RESUME_STEP.skill ? data : [data]
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

        let resumeId = resumeData._id
        let download = resumeData?.download
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
                                    performances: 1

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
                // {
                //     $lookup: {
                //         from: ModelName.skills,
                //         localField: 'steps.data',
                //         foreignField: '_id',
                //         as: 'steps.data.skills'
                //     }
                // },
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
                {
                    $group: {
                        _id: {
                            _id: '$_id',
                            step: '$steps.step'
                        },
                        data: { $push: '$steps.data' },
                        __v: { $first: '$__v' }
                    }
                },
                {
                    $group: {
                        _id: '$_id._id',
                        steps: { $push: { step: '$_id.step', data: '$data' } },
                        __v: { $first: '$__v' }
                    }
                },
                {
                    $project: {
                        _id: "$_id",
                        steps: "$steps",
                        userId: "$userId",
                        userData: "$userData",
                        is_active: "$is_active",


                    }
                }
            ];

            finalResponse.previewData = await this.getResumeAggregate(pipeline)
        }
        if (download == 'true')
            finalResponse.fileContent = await this.previewPDFpreview(finalResponse.previewData)
        else finalResponse.currentStep = await this.getResumeSchemaInfo(resumeId)
        return finalResponse

    }
    //#endregion

    //#region  preview resume in pdf formate
    async previewPDFpreview(data: any) {

        const fileContent = `
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification</title>
          </head>
          <body>
            <div>
              Please verify your mail
              <a href="#">Verify here</a>
            </div>
          </body>
        </html>`;

        return fileHelperService.generatePDF(fileContent, './sample.pdf')
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
                                            $and: [
                                                {
                                                    $eq: ["$$summary._id",
                                                        "$$summaryId"]
                                                },
                                                {
                                                    $eq: ["$$summary.type",
                                                        SUMMARY_ABT]
                                                },

                                            ]
                                        }
                                    }
                                }
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
    async getResumeSchemaInfo(resumeId: Types.ObjectId) {
        const match: any = { is_active: ACTIVE }
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
                const nextOptions = [{ $match: { sectionID: resumeData.currentStep } }, { $project: { order: 1 } }]
                const getNextOrder = await this.getResumeSchemaAggregate(nextOptions)
                if (getNextOrder) match["order"] = (getNextOrder?.order ?? 0) + 1

            }
            // return resumeData
        } else
            match["order"] = 1
        const mainOptions = [{ $match: match }]
        return await this.getResumeSchemaAggregate(mainOptions)

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
                const dataTypes = field.dataTypes
                if (dataTypes[is_array]) {
                    modifiedObj = payload
                    break
                } const checkField: any = Object.keys(payload).find((pKey: any) => field.name == pKey)
                if (!checkField)

                    if (!field.dataTypes[is_optional]) throw new HttpError(`Require field missing :${field.name}`)
                    else continue

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
                customValidationDataTypes(dataTypes, value, checkField, payload)
            }
        }
        return { schemaData, customPayload: modifiedObj }
    }
    //#endregion


}
