import { Model } from "mongoose";
import { CONSTANTS } from "../utils/v1/constants";
import { addJson, findJsonInJsonArray } from "../utils/v1/helper";
import { Document, model, Schema, SchemaOptions } from "mongoose";
import { config } from "../utils/v1/config";
import { schema } from "../db/dynamicmodels";
import bcrypt from 'bcryptjs';

export interface Iuser{
    name?:string;
    password?:string,
    countryCode?:string;
    phone?:string;
    comparePassword(password: string): Promise<boolean>;

    }

const userSchema=new Schema({
    name:String,
    password:{type:String,required:true},
    countryCode:String,
    phone:String,
},{
  timestamps: true,
  versionKey: false,
} as SchemaOptions,
);




userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

export const UserModel: Model<Iuser> = model<Iuser>(CONSTANTS.COLLECTIONS.USER_COLLECTION, userSchema);

const outcome = findJsonInJsonArray(config.DYNAMIC_MODELS, CONSTANTS.COLLECTIONS.USER_COLLECTION, "name");
if (!outcome) {
  const obj: Record<string, string | typeof UserModel> = {};
  addJson(obj, "name", CONSTANTS.COLLECTIONS.USER_COLLECTION);
  addJson(obj, "model", UserModel);

  config.DYNAMIC_MODELS.push(obj);
}