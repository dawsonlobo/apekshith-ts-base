import passport from "passport";
import express from 'express';
import { Strategy as BearerStrategy } from "passport-http-bearer";
import Jwt from "jsonwebtoken";
import { UserModel } from "../models/userModels";
import { log } from "console";
import { json } from "express";

// Define the type of the decoded JWT payload
const app=express();
app.use(express.json());

interface JwtPayload {
  _id: any;
  phone: string;
  // Add any other properties that are in your token payload
}

passport.use(
  new BearerStrategy(async (token, done) => {
    console.log(token+" this is the token i am recieving");
    // const secret = process.env.JWT_SECRET || 'your_secret_key'; 
    //   const decoded = Jwt.verify(token, secret) as JwtPayload; // Type the decoded payload
    //   console.log(decoded+" this is decoded here");

    
    
    try {
      const secret = process.env.JWT_SECRET || 'your_secret_key'; 
      const decoded = Jwt.verify(token, secret) as JwtPayload; // Type the decoded payload
      console.log((decoded._id) + " this is decoded id");
      console.log(decoded + " this is decoded object");
      const jsonString = JSON.stringify(decoded);
      console.log(jsonString," stringified object");
      
      

      // Replace with your logic to validate the user from the token payload
      const user = await UserModel.findById(decoded._id); // Find user by ID from the token

      if (!user) {
        // return done(null, false, { message: 'User not found' }); // User not found
        console.log(user);
        
      }

      return done(null, user); // Successful authentication
    } catch (error) {
      console.error('Error in Bearer Strategy:', error);
      return done(error, false); // Return error in case of invalid token or other issues
    }
  })
);
