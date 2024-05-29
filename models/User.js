import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";
import { ENUM_SUBSCRIPTIONS } from "../constants/user-constants.js";

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ENUM_SUBSCRIPTIONS,
    default: ENUM_SUBSCRIPTIONS[0],
  },
  avatarURL: {
      type:String
    },
  token:String

}, { versionKey: false });

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateSettings);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);
export default User;