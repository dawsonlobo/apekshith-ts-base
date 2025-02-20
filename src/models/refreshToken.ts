import { Document, Schema, Types, Model, model, SchemaOptions, FilterQuery } from "mongoose";
import { addJson, findJsonInJsonArray } from "../utils/v1/helper";
import { config } from "../utils/v1/config";
import { CONSTANTS } from "../utils/v1/constants";
import { ObjectId } from "mongodb";

export interface Irefreshtoken extends Document{
    token?:string;
    userId?:Types.ObjectId;
    createdAt?:Date;
    updatedAt?:Date;
}

const refreshTokenSchema = new Schema({
    token:{type:String},
    userId:{type:Types.ObjectId},

},
{
  timestamps: true,
  versionKey: false,
} as SchemaOptions,
);


 refreshTokenSchema.set("toObject", { virtuals: true });
  refreshTokenSchema.set("toJSON", { virtuals: true });
  

  export const RefreshTokenModel: Model<Irefreshtoken> = model<Irefreshtoken>(CONSTANTS.COLLECTIONS.REFRESHTOKEN_COLLECTION, refreshTokenSchema);
  
  const outcome = findJsonInJsonArray(config.DYNAMIC_MODELS, CONSTANTS.COLLECTIONS.REFRESHTOKEN_COLLECTION, "name");
  if (!outcome) {
    const obj: Record<string, string | typeof RefreshTokenModel> = {};
    addJson(obj, "name", CONSTANTS.COLLECTIONS.REFRESHTOKEN_COLLECTION);
    addJson(obj, "model", RefreshTokenModel);
  
    config.DYNAMIC_MODELS.push(obj);
  }
  