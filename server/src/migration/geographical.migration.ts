import { Response, Request, } from "express";
import { City, Country, State } from "country-state-city";
import { GeographicalHelper } from "../helper.services.ts/geographical.helper";
import { ACTIVE } from "../common/constant";
import { Success } from "../common/string";
import { CityModel } from "../models/geographical.model";
import * as university from "world-universities-search"
export class GeographicalService {
    constructor() { }

    //#region  migrate counties
    static async migrateCountries(req: Request, res: Response): Promise<Response> {
        // get all country
        const countryList = Country.getAllCountries().map(each => {
            return { name: each.name, code: each.isoCode, flag: each.flag, phoneCode: each.phonecode, }
        })

        GeographicalHelper.createCounties(countryList)
        const stateList = State.getAllStates()
            .map(each => {
                return { name: each.name, stateCode: each.isoCode, countryCode: each.countryCode, }
            })
        await GeographicalHelper.createStates(stateList)

        await GeographicalHelper.deleteModelData(CityModel)
        const groupState = await GeographicalHelper.groupByState()
        await GeographicalService.migrateAllCities(groupState)

        return res.json({})
    }
    //#endregion

    //#region  migrate all city with country
    static async migrateAllCities(groupState: any = []): Promise<any> {
        if (groupState.length == 0) return []
        let sliceArr = groupState.splice(0, 10)
        console.log({ sliceArr: sliceArr.length, groupState: groupState.length })

        if (sliceArr.length == 0) return []
        for (let i = 0; i < sliceArr.length; i++) {
            try {
                const stateCode = sliceArr[i].state
                const countryCode = sliceArr[i].countryCode
                const cities = City.getCitiesOfState(countryCode, stateCode)
                    .map(each => {
                        return { name: each.name, stateCode: each.stateCode, countryCode: each.countryCode, }
                    })
                const createdCities = await GeographicalHelper.createCities(cities)
                console.log({ createdCities: createdCities.length })
            } catch (e) {

            }
        }
        return await GeographicalService.migrateAllCities(groupState)

    }

    //#region get all counties
    static async getAllCounties(req: Request, res: Response): Promise<Response> {
        const userInput = req.query
        const options: any = { is_active: ACTIVE }
        let list: any = []
        if (userInput.search_text) {
            options['name'] = { '$regex': userInput.search_text }
        }
        list = await GeographicalHelper.getAllCounties(options)
        const responseData = {
            data: list,
            message: Success
        }
        return res.json(responseData)

    }
    //#endregion

    //#region get all states
    static async getAllStates(req: Request, res: Response): Promise<Response> {
        const userInput = req.query
        const options: any = {
            is_active: ACTIVE,
            countryCode: userInput.countryCode
        }
        if (userInput.search_text)
            options['name'] = { '$regex': userInput.search_text }
        const list = await GeographicalHelper.getAllStates(options)
        const responseData = {
            data: list,
            message: Success
        }
        return res.json(responseData)

    }//#endregion

    //#region get all cities
    static async getAllCities(req: Request, res: Response): Promise<Response> {
        const userInput = req.query
        const options: any = {
            is_active: ACTIVE,
            countryCode: userInput.countryCode,
            stateCode: userInput.stateCode
        }

        if (userInput.search_text)
            options['name'] = { '$regex': userInput.search_text }
        const list = await GeographicalHelper.getAllCities(options)
        const responseData = {
            data: list,
            message: Success
        }
        return res.json(responseData)
    }
    //#endregion

    //#region  search university
    static async getUniversity(req: Request, res: Response) {
        const userInput: any = req.query
        const name = university.find(userInput.name)
        return res.json({ name })

    }
    //#endregion


}

