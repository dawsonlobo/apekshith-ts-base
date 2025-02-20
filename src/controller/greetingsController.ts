import { NextFunction, Request, Response } from "express";
import * as Dynamic from "../db/dynamicmodels";
import { CONSTANTS } from "../utils/v1/constants";
import { IProject } from '../utils/v1/customTypes'
import { ObjectId } from "mongodb";
import { isObject } from "lodash";
import {ErrorCodes} from "../db/models"
import packageJson from "../../package.json"; 



export async function  greetings(req: Request, res: Response,next:NextFunction) {

    try{
         console.log(`Hello, your version is ${packageJson.version}`);
         console.log(req.txId);
         
         
         
       
         
        }catch (err) {
            req.apiStatus = {
              isSuccess: false,
              error: ErrorCodes[1006],
              message: "Something went wrong",
              toastMessage: "Something went wrong",
            };
   }
   
   
   
   }