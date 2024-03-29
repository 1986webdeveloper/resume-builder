import mongoose, { Types } from "mongoose";
import { ACTIVE, ModelName } from "../common/constant";

// user skills define here
const userResumeModel = new mongoose.Schema({
    steps: [
        {
            step: {
                type: String,
                required: true,
            },
            is_active: {
                type: Boolean,
                default: ACTIVE
            },
            data: {
                type: [Object],
                required: true,
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
    currentStep: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: false,
    }

}, {
    timestamps: true,
});

//create new user resume model

export const UserResumeModel = mongoose.model(ModelName.userResume, userResumeModel);
