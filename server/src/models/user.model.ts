import mongoose, { Model } from "mongoose";
import { ModelName } from "../common/constant";
import { CryptoService } from "../common/crypt.service";

// user schema define here
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    maxLength: 20,
  },
  last_name: {
    type: String,
    required: true,
    maxLength: 20,
  },

  email: {
    type: String,
    required: true,
    set: CryptoService.encryptText,
    get: CryptoService.decryptText,
    maxLength: 255,
  },

  password: {
    type: String,
    required: false,
  },
  otp: {
    type: String,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  password_attemps: {
    type: Number,
    required: false,
    default: 0
  },
  cool_off_date: {
    type: Date,
    required: false
  }
});

//create new user model
export const UserModel = mongoose.model(ModelName.userModel, userSchema);
