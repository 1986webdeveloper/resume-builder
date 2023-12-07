import mongoose from "mongoose";
import { ACTIVE, ModelName, SummaryType } from "../common/constant";

// user degignation define here
const designationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
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
        type: {
            type: String,
            enum: SummaryType
        }
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

//create new user designation
export const DesignationModel = mongoose.model(ModelName.designationModel, designationSchema);
