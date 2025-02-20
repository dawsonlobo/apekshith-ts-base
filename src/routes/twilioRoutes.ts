import express,{Router} from 'express';
import dotenv from 'dotenv';
import { TwilioService } from '../services/twilio/twilio'; 

const router=Router();
dotenv.config();

router.get('/sms', async (req, res) => {
    try {
        const testPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER || ''; 
        const testMessage = 'Your OTP for Exelon is 5559';
        const result = await TwilioService.sendSMS(testPhoneNumber, testMessage);
        res.status(200).json({ message: 'SMS sent successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error sending SMS', error: error });
    }
});

router.get('/whatsapp', async (req, res) => {
    try {
        const testPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER || ''; 
        const testMessage = 'Hello aliens';
        const result = await TwilioService.sendWhatsApp(testPhoneNumber, testMessage);
        res.status(200).json({ message: 'WhatsApp message sent successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error sending WhatsApp message', error: error });
    }
});

router.get('/call', async (req, res) => {
    try {
        const testPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER || ''; 
        const testMessage = 'Hello, this is a test call from Exelon.';
        const result = await TwilioService.makeCall(testPhoneNumber, testMessage);
        res.status(200).json({ message: 'Call initiated successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error making call', error: error });
    }
});

export default router;