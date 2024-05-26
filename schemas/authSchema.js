import Joi from "joi";
import { ENUM_SUBSCRIPTIONS, emailRegexp } from "../constants/user-constants.js";

export const authSignupSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid(...ENUM_SUBSCRIPTIONS),
});

export const authSigninSchema = Joi.object({
   email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
}) 
export const updateSubscriptionSchema = Joi.object({
  subscription:Joi.string().valid(...ENUM_SUBSCRIPTIONS)
}) 