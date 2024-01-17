import { Model } from "mongoose";
import { CityModel, CountryModel, StateModel } from "../models/geographical.model";


export class GeographicalHelper {

    //#region  
    static async createCounties(data: any) {
        await this.deleteModelData(CountryModel)
        return await CountryModel.insertMany(data, { ordered: false })
    }
    //#endregion

    //#region  
    static async createStates(data: any) {
        await this.deleteModelData(StateModel)
        return await StateModel.insertMany(data, { ordered: false })
    }
    //#endregion

    //#region  
    static async createCities(data: any) {
        return await CityModel.insertMany(data, { ordered: true })
    }
    //#endregion

    //#region  delete model 
    static async deleteModelData(model: any) {
        return await model.deleteMany({})
    }
    //#endregion

    //#region get all counties
    static async getAllCounties(options: {}, attributes: [] | [string] = []) {
        return await CountryModel.find(options)
            .select(['_id', 'name', 'code', 'phoneCode', 'flag', ...attributes])
    }
    //#endregion

    //#region get all state
    static async getAllStates(options: {}, attributes: [] | [string] = []) {
        return await StateModel.find(options)
            .select(['_id', 'name', 'stateCode', 'countryCode', ...attributes])
    }
    //#endregion

    //#region get all city
    static async getAllCities(options: {}, attributes: [] | [string] = []) {
        return await CityModel.find(options)
            .select(['_id', 'name', 'countryCode', 'stateCode', ...attributes])
    }
    //#endregion

    //#region  aggregateQuery
    static async groupByState() {

        return await StateModel.aggregate([
            {
                $group: {
                    _id: {
                        countryCode: '$countryCode', stateCode: '$stateCode'
                    },
                    totalStates: { $sum: 1 }, // Count of states in each group
                    totalActiveStates: { $sum: { $cond: [{ $eq: ['$is_active', true] }, 1, 0] } },
                },
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    state: '$_id.stateCode',
                    countryCode: '$_id.countryCode',
                    totalStates: '$totalStates',
                    totalActiveStates: '$totalActiveStates',
                },
            },


        ]).exec()
    }
}