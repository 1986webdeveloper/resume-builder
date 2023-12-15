import { Types } from "mongoose"
import { UserResumeModel } from "../models/user.resume.model"
import { HttpError, getClassProperties } from "../common/error.service"
import { errorRecordNotCreated, errorRecordNotUpdated } from "../common/string"
import { ACTIVE, ModelName, PRE_DEFINED_ALLOWED_VALUES, RESUME_STEP } from "../common/constant"
import { PipelineStage } from "mongoose"
import { DataTypeModel } from "../models/data.types.model"
import { Designation, EducationDetails, ExperienceDetails, PersonalDetails } from "../validations/resume.validation"

export const userResumeService = new class {


    //#region create new user resume
    async createUserResume(data: any) {
        return await new UserResumeModel(data).save()
    }
    //#endregion

    //#region  update user resume 
    async updateUserResume(filter: any, updateData: any) {
        return await UserResumeModel.findOneAndUpdate(filter, updateData, { returnDocument: "after" })
    }
    //#endregion

    //#region  findData
    async getResumeData({ filter, attributes = [], projection = {} }: { filter: any; attributes?: [] | string[]; projection?: any }) {
        return await UserResumeModel.findOne(filter, projection).select(attributes)
    }
    //#endregion

    //#region check step and create 
    async createORAddStepData(step: String, data: any, resumeId: any = null, userId: Types.ObjectId | null = null) {

        let newData
        data._id = new Types.ObjectId()
        if (step == RESUME_STEP.personal) {
            const createData = {
                steps: [{
                    step: RESUME_STEP.personal,
                    data: [{ _id: new Types.ObjectId(), ...data }],
                }],
                userId
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
                            data: [data]
                        }
                    }
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
    async getResumeAggregate(options: PipelineStage[]) {
        const result: any = await UserResumeModel.aggregate(options).exec()
        return result[0] ? result[0] : null
    }


    //#region  check user resume current step
    async checkUsercurrentStep(resumeData: any) {

        const resumeId = resumeData._id

        const pipeline: any = [
            { $match: { "_id": new Types.ObjectId(resumeId) } },
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
            {
                $lookup: {

                    from: ModelName.designationModel,
                    localField: 'steps.data.designationId',
                    foreignField: '_id',
                    as: 'steps.data.designationData',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            }
                        }]
                }
            },
            {
                $unwind: {
                    path: '$steps.data.states',
                    preserveNullAndEmptyArrays: true
                },

            },
            // {
            //     $unwind: {
            //         path: '$designationData',
            //         preserveNullAndEmptyArrays: true
            //     },
            // },
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
                    // Add other fields you want to keep in this $group stage
                }
            },
            {
                $group: {
                    _id: '$_id._id',
                    steps: { $push: { step: '$_id.step', data: '$data' } },
                    __v: { $first: '$__v' }
                    // Add other fields you want to keep in this $group stage
                }
            },

        ];

        const result = await this.getResumeAggregate(pipeline)
        const steps = result?.steps ?? []
        const currentStepsData = [
            {
                nextStep: RESUME_STEP.personal,
                validator: getClassProperties(PersonalDetails)
            },
            {
                nextStep: RESUME_STEP.designation,
                validator: getClassProperties(Designation)

            },
            {
                nextStep: RESUME_STEP.experience,
                validator: getClassProperties(new ExperienceDetails())
            }, {
                nextStep: RESUME_STEP.education,
                validator: getClassProperties(new EducationDetails())

            }, {
                nextStep: RESUME_STEP.skill,

                validator: [Types.ObjectId]
            },
            {
                nextStep: RESUME_STEP.preview,
            }]
        return currentStepsData.find((currStep: any) => {
            let is_pending = steps.every((stepObj: { step: string }) => stepObj.step != currStep.nextStep)
            currStep.data = result
            if (is_pending)
                return currStep
        })
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
}