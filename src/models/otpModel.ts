import { Model } from "mongoose";
import { CONSTANTS } from "../utils/v1/constants";
import { addJson, findJsonInJsonArray } from "../utils/v1/helper";
import { Document, model, Schema, SchemaOptions } from "mongoose";
import { config } from "../utils/v1/config";
import { schema } from "../../../db/dynamicmodels";


export interface Iotp{
    phone?:string;
    countryCode?:string;
    otp?:string;
    expirationTime?:Date;
    isVerified?:boolean;
    }

const otpSchema=new Schema({
    phone:String,
    countryCode:String,
    otp:String,
    expirationTime:Date,
    isVerified: { type: Boolean, default: false },

},
{
  timestamps: true,
  versionKey: false,
} as SchemaOptions,
);


otpSchema.set("toObject", { virtuals: true });
otpSchema.set("toJSON", { virtuals: true });

export const OtpModel: Model<Iotp> = model<Iotp>(CONSTANTS.COLLECTIONS.OTP_COLLECTION, otpSchema);

const outcome = findJsonInJsonArray(config.DYNAMIC_MODELS, CONSTANTS.COLLECTIONS.OTP_COLLECTION, "otps");
if (!outcome) {
  const obj: Record<string, string | typeof OtpModel> = {};
  addJson(obj, "name", CONSTANTS.COLLECTIONS.OTP_COLLECTION);
  addJson(obj, "model", OtpModel);

  config.DYNAMIC_MODELS.push(obj);
}