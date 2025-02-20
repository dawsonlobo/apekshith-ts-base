import { Document, Schema, Types, Model, model, SchemaOptions, FilterQuery } from "mongoose";
import { addJson, findJsonInJsonArray } from "../utils/v1/helper";
import { config } from "../utils/v1/config";
import { CONSTANTS } from "../utils/v1/constants";
import { ObjectId } from "mongodb";

export interface Iaccesstoken extends Document{
    token?:string;
    userId?:Types.ObjectId;
    createdAt?:Date;
    updatedAt?:Date;
}

const accessTokenSchema = new Schema({
    token:{type:String},
    userId:{type:Types.ObjectId},

},
{
  timestamps: true,
  versionKey: false,
} as SchemaOptions,
);


 accessTokenSchema.set("toObject", { virtuals: true });
  accessTokenSchema.set("toJSON", { virtuals: true });
  

  export const AccessTokenModel: Model<Iaccesstoken> = model<Iaccesstoken>(CONSTANTS.COLLECTIONS.ACCESSTOKEN_COLLECTION, accessTokenSchema);
  
  const outcome = findJsonInJsonArray(config.DYNAMIC_MODELS, CONSTANTS.COLLECTIONS.ACCESSTOKEN_COLLECTION, "name");
  if (!outcome) {
    const obj: Record<string, string | typeof AccessTokenModel> = {};
    addJson(obj, "name", CONSTANTS.COLLECTIONS.ACCESSTOKEN_COLLECTION);
    addJson(obj, "model", AccessTokenModel);
  
    config.DYNAMIC_MODELS.push(obj);
  }
  