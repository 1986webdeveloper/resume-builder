import mongoose, { Schema } from "mongoose";
import { ACTIVE, ModelName } from "../common/constant";

const countrySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        maxLength: 5,
        required: true,
        unique: true,
    },
    flag: {
        type: String,
        required: true,
        unique: true,
    },
    phoneCode: {
        type: String,
        maxLength: 20,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: ACTIVE
    },

})



export const CountryModel = mongoose.model(ModelName.counties, countrySchema)

const stateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    countryCode: {
        type: String,
        maxLength: 5,
        required: true,
    },
    stateCode: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: ACTIVE
    },


})

export const StateModel = mongoose.model(ModelName.states, stateSchema)

const citySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    countryCode: {
        type: String,
        maxLength: 5,
        required: true,
    },
    stateCode: {
        type: String,
        maxLength: 5,
        required: true,
    },

    is_active: {
        type: Boolean,
        default: ACTIVE
    },


})

export const CityModel = mongoose.model(ModelName.cities, citySchema)
