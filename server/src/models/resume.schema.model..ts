import mongoose, { Document, Model, Types } from "mongoose";
import { ACTIVE, ModelName, PRE_DEFINED_ALLOWED_VALUES } from "../common/constant";

// user resume schema  define here
const resumeSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true,
    },
    sectionID: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    order: {
        type: Number,
        required: true,
    },
    fields: [
        {
            name: {
                type: String,
                required: true,
            },
            is_active: {
                type: Boolean,
                default: ACTIVE
            },
            dataTypes: {
                type: Object,
                default: PRE_DEFINED_ALLOWED_VALUES
            },

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
// user resume schema  define here
export const ResumeSchemaModel = mongoose.model(ModelName.resumeSchema, resumeSchema);
