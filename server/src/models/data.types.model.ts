import mongoose, { Types } from "mongoose";
import { ACTIVE, ModelName, PRE_DEFINED_ALLOWED_VALUES } from "../common/constant";

// user skills define here
const dataTypesSchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true,
    },
    allowedValueTypes: {
        type: mongoose.Schema.Types.Mixed,
        default: PRE_DEFINED_ALLOWED_VALUES
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
}, {
    timestamps: true,
});

//create new data type model

export const DataTypeModel = mongoose.model(ModelName.dataTypes, dataTypesSchema);
