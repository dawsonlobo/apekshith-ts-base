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
    req.apiStatus = {
      isSuccess: true,
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      toastMessage: "Login successful",
    };
    next();
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`${error.message} `);
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1012],
        data: error.message || "Login failed",
        toastMessage: "Login failed",
      };
    }
};




export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    
  try {
        const { phone } = req.body;
        
        if (!phone) {
            res.status(400).json({ message: "Phone number is required" });
            return;
        }

        const user = await UserModel.findOne({ phone }).select("-password"); // Exclude password
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
 
      
export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
      const { id } = req.query; // Get user ID from query parameters
      const updateData = { ...req.body };

      if (!id) {
          res.status(400).json({ message: "User ID is required" });
          return;
      }

      // Ensure password is not updated directly
      if (updateData.password) {
          delete updateData.password;
      }

      const user = await UserModel.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

      if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
      }

      req.apiStatus = {
          isSuccess: true,
          data: user,
          toastMessage: "Profile updated successfully.",
      };
      next();
  } catch (error) {
      req.apiStatus = {
          isSuccess: false,
          data: "Failed to update profile",
          log: error,
      };
      next();
  }
}







export async function greet(){
  console.log("Hello")  ;
 
  
}