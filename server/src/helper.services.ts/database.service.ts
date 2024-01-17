import { Model } from "mongoose";
import { CityModel, CountryModel, StateModel } from "../models/geographical.model";

interface LookUp {
    [key: string]: any;
    from: string,
    localField: string,
    foreignField: string,
    as?: string,
    pipeline: [any] | any[]

}
//#region  get lookup object 
export const prepareLookUp = (options: LookUp) => {


    const query: any = {
        $lookup: {
        }
    }
    for (let key in options) {
        query['$lookup'][key] = options[key]
    }
    return query
}
//#endregion

//#region  unwind array
export const unwindArr = (path: string) => {
    const query = {
        $unwind: {
            path,
            preserveNullAndEmptyArrays: true
        },
    }
    return query
}
//#endregion