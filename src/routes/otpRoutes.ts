import express,{Router} from 'express';
import * as otp from "../controller/otpController"
import { entryPoint } from "../middleware/entrypoint";
import { exitPoint } from "../middleware/exitpoint";



const router=Router();

router.post('/otp/send',entryPoint,otp.sendOtp,exitPoint);
router.post('/otp/verify',entryPoint,otp.verifyOtp,exitPoint);

export default router;




