import mongoose, { Types } from "mongoose";
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
            type: Types.ObjectId,
            required: true,
            ref: ModelName.userModel,
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
        type: Types.ObjectId,
        required: true,
        ref: ModelName.userModel,
    },

}, {
    timestamps: true,
});

//create new user designation
export const DesignationModel = mongoose.model(ModelName.designationModel, designationSchema);
