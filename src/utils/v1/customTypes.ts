import { Schema } from "mongoose";
import * as users from "../../db/dynamicmodels";

declare global {
  namespace Express {
    interface Request {
      apiStatus?: {
        isSuccess?: boolean;
        message?: string;
        data?: object | object[] | string;
        error?: {
          statusCode: number;
          message: string;
          toastMessage?: string;
        };
        log?: string | object | unknown;
        count?: number;
        toastMessage?: string;
      };
      startTime?: number;
      txId?: string;
      path?: string;
      baseUrl?: string;
    }
  }
}
export interface CallbackFunction {
  (error: Error | null, data: object | object[] | null): void;
}

export interface IOption {
  _id?: Schema.Types.ObjectId | unknown;
  type?: string;
  name?: string;
  value?: string;
  image?: string;
  isEnabled?: boolean;
  isDeleted?: boolean;
  isDemo?: boolean;
}

export interface IOptions extends IOption {
  page?: string;
  itemsPerPage?: string;
  referenceId?: string;
  sortBy?: string[];
  sortDesc?: boolean[];
}

export interface ISearch {
  term?: string;
  fields?: string[];
  endsWith?: boolean;
  startsWith?: boolean;
}
export interface IFilter {
  [key: string]: string[] | number[] | object[];
}
export interface IProject {
  [key: string]: number;
}

export interface IUser extends users.IUser {
  _id?: Schema.Types.ObjectId | unknown | string;
}


export interface IAdmin extends users.IAdmin {
  _id?: Schema.Types.ObjectId | unknown | string;
}