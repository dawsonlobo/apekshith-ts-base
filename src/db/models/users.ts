import { Document, Schema, Model, model, SchemaOptions } from "mongoose";
import { addJson, findJsonInJsonArray } from "../../utils/v1/helper";
import { config } from "../../utils/v1/config";
import { CONSTANTS } from "../../utils/v1/constants";
import { ObjectId } from "mongodb";

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: Unique identifier of the user
 *          example: "64d2fa92e5b5f7765e4e13a2"
 *        email:
 *          type: string
 *          description: Email address of the user
 *          example: "shashank@gmail.com"
 *        name:
 *          type: string
 *          description: Full name of the user
 *          example: "Shashank"
 *        company:
 *          type: string
 *          description: Name of the company the user is associated with
 *          example: "EventWorld"
 *        role:
 *          type: string
 *          description: Role of the user
 *          enum:
 *            - ADMIN
 *            - USER
 *          example: "USER"
 *        countryCode:
 *          type: string
 *          description: Country code of the user's phone number
 *          example: "91"
 *        phone:
 *          type: string
 *          description: Phone number of the user
 *          example: "9876543210"
 *        isAcceptTnc:
 *          type: boolean
 *          description: Indicates if the user has accepted the terms and conditions
 *          example: true
 *        isEnabled:
 *          type: boolean
 *          description: Indicates if the user account is enabled
 *          example: true
 *        isVerified:
 *          type: boolean
 *          description: Indicates if the user's email or phone is verified
 *          example: false
 *        isDeleted:
 *          type: boolean
 *          description: Indicates if the user account is deleted
 *          example: false
 *        createdAt:
 *          type: string
 *          format: date-time
 *          description: Date and time when the user account was created
 *          example: "2024-12-01T12:34:56.789Z"
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          description: Date and time when the user account was last updated
 *          example: "2024-12-10T09:30:45.123Z"
 *        isDemo:
 *          type: boolean
 *          description: Indicates if the user is on a demo account
 *          example: false
 */

export interface IUser {
  email?: string;
  name?: string;
  company?: string;
  role?: [string] | string;
  countryCode?: string;
  phone?: string;
  isAcceptTnc?: boolean;
  isEnabled?: boolean;
  isVerified?: boolean;
  isDeleted?: boolean;
  isDemo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUserModel extends IUser, Document {}

export const UserSchema: Schema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    company: { type: String },
    phone: { type: String },
    countryCode: { type: String },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER, // Default role is 'USER'
    },
    isEnabled: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isDemo: { type: Boolean, default: false },
    isAcceptTnc: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    usePushEach: true,
    bufferCommands: true,
    versionKey: false,
  } as SchemaOptions,
);
// Create a compound unique index on countryCode and phone
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

export const UserModel: Model<IUserModel> = model<IUserModel>(
  CONSTANTS.COLLECTIONS.USER_COLLECTION,
  UserSchema,
);

const outcome = findJsonInJsonArray(config.DYNAMIC_MODELS, CONSTANTS.COLLECTIONS.USER_COLLECTION, "name");
if (!outcome) {
  const obj: Record<string, string | typeof UserModel> = {};
  addJson(obj, "name", CONSTANTS.COLLECTIONS.USER_COLLECTION);
  addJson(obj, "model", UserModel);

  config.DYNAMIC_MODELS.push(obj);
}

// export const findById = async (id: ObjectId): Promise<IUser | null> => {
//   try {
//     const result = await UserModel.findById(id);
//     return result;
//   } catch (error) {
//     // throw new Error(`Error finding user by ID: ${error.message}`);
//   }
// };

export const createUser = function (
  UserObj: IUser,

  cb: (error: Error | null, result: null | IUser) => void,
) {
  const user = new UserModel(UserObj);

  user
    .save()
    .then(result => {
      cb(null, result);
    })
    .catch(error => {
      cb(error, null);
    });
};
