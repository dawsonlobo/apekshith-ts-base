import { Request, Response ,NextFunction} from "express";
import {UserModel} from "../models/userModels"
import * as   Dynamic from '../db/dynamicmodels'
import { CONSTANTS } from '../utils/v1/constants'
import {} from "../models/userModels"
import { ErrorCodes } from "../models/models";
import { generateTokens, verifyRefreshToken } from "../passport/jwt";
import { AccessTokenModel } from "../models/accessToken";
import { RefreshTokenModel} from "../models/refreshToken";
import {searchApiInputWithMultiSearch,filtering,searchingWithMultiSearch,aggregationForSearchApi} from '../controller/generic/index'





export async function addUser (req: Request, res: Response,next:NextFunction):Promise<void>  {
    try{
        const {
            name,
            password,
            countryCode,
            phone,
            
        } = req.body;
        const existingUser = await UserModel.findOne({ phone });
        if (existingUser) { res.status(400).json({ message: "User already exists" });
        return}
        
        let newUser = new UserModel({
            name,
            password,
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



export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    
  try {
        const { phone } = req.query;
        
        if (!phone) {
            res.status(400).json({ message: "Phone number is required" });
            return;
        }

        const user = await UserModel.findOne({ phone });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        req.apiStatus = {
            isSuccess: true,
            data: user,
            toastMessage: "User retrieved successfully.",
        };
        next();
        return;
    } catch (error) {
        req.apiStatus = {
            isSuccess: false,
            data: "Failed to fetch user",
            log: error,
        };
        next();
    }
}
 
      



export async function login(req:Request, res:Response,next:NextFunction):Promise<void> {
    const { phone, password } = req.body;
  
    try {
      const user = await UserModel.findOne({ phone });
      
      if (!user || !(user.password===password)) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
  
      const { accessToken, refreshToken } = generateTokens(user.id);
      
      const newAccessToken = new AccessTokenModel({
        token: accessToken,
        userId: user._id,
      });
  
      await newAccessToken.save(); // Save the access token in the database

      const newRefreshToken = new RefreshTokenModel({
        token: accessToken,
        userId: user._id,
      });
  
      await newRefreshToken.save(); // Save the refresh token in the database
  
      await user.save();
  
      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };