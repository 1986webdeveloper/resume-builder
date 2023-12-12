import mongoose from "mongoose";
import { ACTIVE, ModelName } from "../common/constant";

// user education define here
const educationSchema = new mongoose.Schema({
    degreeType: {
        type: String,
        required: true,
        unique: true,
    },
    performances: [{
        label: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        is_active: {
            type: Boolean,
            default: ACTIVE
        },
        userId: {
            type: Object,
            required: true
        },
    }],
    summaries: [{
        summary: {
            type: String,
        },
        is_active: {
            type: Boolean,
            default: ACTIVE
        },
        userId: {
            type: Object,
            required: true
        },

    }],
    is_active: {
        type: Boolean,
        default: ACTIVE
    },
    userId: {
        type: Object,
        required: true
    },

}, {
    timestamps: true,
});

//create new user education
export const EducationModel = mongoose.model(ModelName.educations, educationSchema);
