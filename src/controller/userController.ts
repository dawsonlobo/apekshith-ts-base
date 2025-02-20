import { Request, Response ,NextFunction} from "express";
import {UserModel} from "../models/userModels"
import { ErrorCodes } from "../models/models";


export async function addUser (req: Request, res: Response,next:NextFunction)  {
    try{
        const {
            name,
            countryCode,
            phone,
            
        } = req.body;
            console.log(name);
            
        let newUser = new UserModel({
            name,
            countryCode,
            phone,
        
        });

       let user= await newUser.save();
       if(user){
        req.apiStatus = {
            isSuccess: true,
            data: "User created successfully",
            toastMessage: "User created successfully.",
          };
          next();
          return;
        }
       }
catch(error){
    req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1010],
        data: "Failed to refresh token",
        log: error,
      };

    }
}
