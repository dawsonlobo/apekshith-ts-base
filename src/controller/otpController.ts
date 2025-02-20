import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/userModels";
import { OtpModel } from "../models/otpModel"; // OTP model import
import { TwilioService } from "../services/twilio/twilio"; // Import Twilio service

// Twilio Response Interface
interface TwilioResponse {
  success: boolean;
  error?: string;
}

export async function sendOtp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { countryCode, phone } = req.body;
      console.log(countryCode);
      
    // 1. Check if the phone number exists in the UserModel collection
    const existingUser = await UserModel.findOne({ phone });
    if (!existingUser) {
      res.status(400).json({
        isSuccess: false,
        message: "Phone number not registered. Please register first.",
      });
      return;
    }

    // 2. Check the OTP collection for the phone number
    const otpRecord = await OtpModel.findOne({ phone });

    if (otpRecord) {
      // If OTP is already present, check if it's verified
      if (otpRecord.isVerified) {
        res.status(400).json({
          isSuccess: false,
          message: "OTP already verified.",
        });
        return;
      }

      const currentTime = new Date().getTime();
      const expirationTime = otpRecord.expirationTime
        ? new Date(otpRecord.expirationTime).getTime()
        : 0;

      // Check if OTP is expired
      if (currentTime > expirationTime) {
        // OTP expired, generate a new OTP
        const otp = generateOtp();
        const newExpirationTime = getExpirationTime(); // Expiration time set to 5 minutes from now

        // Update OTP record with the new OTP and expiration time
        otpRecord.otp = otp;
        otpRecord.expirationTime = newExpirationTime as Date;
        await otpRecord.save();

        // Send OTP via Twilio
        const fullPhoneNumber = `+${countryCode}${phone}`;
        console.log("Full Phone Number:", `+${countryCode}${phone}`);

      const message = `Your OTP is: ${otp}. It will expire in 5 minutes.`;
        const twilioResponse = await TwilioService.sendSMS(
          fullPhoneNumber,
          message
        );

        if (twilioResponse) {
          res.status(200).json({
            isSuccess: true,
            message: "OTP sent successfully. Please verify your OTP.",
          });
          return;
        } else {
          res.status(500).json({
            isSuccess: false,
            message: "Failed to send OTP. Please try again.",
            error: twilioResponse,
          });
          return;
        }
      }

      // OTP is still valid
      res.status(400).json({
        isSuccess: false,
        message: "OTP is still valid. Please verify the existing OTP first.",
      });
      return;
    } else {
      // If no OTP record exists, generate a new OTP and store it in the OTP collection
      const otp = generateOtp();
      const expirationTime = getExpirationTime(); // Set expiration time to 5 minutes

      const newOtpRecord = new OtpModel({
        phone,
        otp,
        expirationTime,
      });

      await newOtpRecord.save();

      // Send OTP via Twilio
      const fullPhoneNumber = `+${countryCode}${phone}`; 
      console.log(fullPhoneNumber);
      
      const message = `Your OTP is: ${otp}. It will expire in 5 minutes.`;
      const twilioResponse = await TwilioService.sendSMS(
        fullPhoneNumber,
        message
      );

      if (twilioResponse) {
        res.status(200).json({
          isSuccess: true,
          message: "OTP sent successfully. Please verify your OTP.",
        });
        return;
      } else {
        res.status(500).json({
          isSuccess: false,
          message: "Failed to send OTP. Please try again.",
          error: twilioResponse,
        });
        return;
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "An error occurred while processing the request.",
      error,
    });
    return;
  }
}



export async function verifyOtp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { phone, otp } = req.body;

    // 1. Check if the OTP exists for the given phone number
    const otpRecord = await OtpModel.findOne({ phone });

    if (!otpRecord) {
      res.status(400).json({
        isSuccess: false,
        message: "OTP not found. Please request a new OTP.",
      });
      return;
    }

    const currentTime = new Date().getTime();
    const expirationTime = otpRecord.expirationTime
      ? new Date(otpRecord.expirationTime).getTime()
      : 0;

    // 2. Check if the OTP is expired
    if (currentTime > expirationTime) {
      res.status(400).json({
        isSuccess: false,
        message: "OTP has expired. Please request a new one.",
      });
      return;
    }

    // 3. Check if the OTP is already verified
    if (otpRecord.isVerified) {
      res.status(400).json({
        isSuccess: false,
        message: "OTP is already verified.",
      });
      return;
    }

    // 4. Validate the provided OTP
    if (otpRecord.otp !== otp) {
      res.status(400).json({
        isSuccess: false,
        message: "Invalid OTP. Please try again.",
      });
      return;
    }

    // 5. If OTP is valid, mark it as verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    res.status(200).json({
      isSuccess: true,
      message: "OTP verified successfully.",
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "An error occurred while verifying the OTP.",
      error,
    });
    return;
  }
}







// Utility function to generate OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Example OTP generation logic
}

// Utility function to get expiration time (5 minutes from now)
function getExpirationTime(): Date {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 5); // Set expiration to 5 minutes
  return expirationTime;
}
