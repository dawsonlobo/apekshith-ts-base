import { RequestHandler } from "express";
import * as Helper from "../utils/v1/helper";


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


export const entryPoint: RequestHandler = (req, res, next) => {
  req.startTime = Date.now();

  req.txId = Helper.generateTransactionId();

  next();
};
