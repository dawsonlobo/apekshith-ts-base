import express from 'express';
import dotenv from 'dotenv';
import greeting from "./routes/greetingRoutes";
import { TwilioService } from '../src/services/twilio/twilio'; 
import message from "./routes/twilioRoutes"
import user from "./routes/userRoutes"
import otp from "./routes/otpRoutes"
// import login from "./routes/loginRoutes"
import './models/userModels'
import passport from "passport";
import "../src/passport/bearer";
import http from "http";
import { Server } from "socket.io";
import mongoose from 'mongoose';

 


const app=express();
const mongoUrl = process.env.mongo_url || "mongodb://localhost:27017/user-otp";
dotenv.config();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
  },
});
const port=process.env.PORT;
app.use(passport.initialize());
app.use(express.json());
app.use('/v1',greeting);
app.use('/v1',message);
app.use('/v1',user);
app.use('/v1',otp);
// app.use('/v1',login);



const testTwilio = async () => {
const testPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER || ''; 
  const testMessage = 'Your OTP for exelon is 5559';

  const result = await TwilioService.sendSMS(testPhoneNumber, testMessage);
  console.log('Test Result:', result);
};
const testWhatsApp = async () => {
  const testPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER|| ''; 
  const testMessage = 'Hello aliens';

  const result = await TwilioService.sendWhatsApp(testPhoneNumber, testMessage);
  console.log('WhatsApp Test Result:', result);
};

async function connectToDatabase() {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Connected to MongoDB with Mongoose");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);  
    }
}
connectToDatabase();

app.listen(port,()=>{
    console.log(`running on http://localhost:${port}`);
    
})