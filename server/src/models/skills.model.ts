import mongoose from "mongoose";
import { ACTIVE, ModelName } from "../common/constant";

// user skills define here
const skillsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
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

//create new user skills
export const SkillsModel = mongoose.model(ModelName.skills, skillsSchema);
