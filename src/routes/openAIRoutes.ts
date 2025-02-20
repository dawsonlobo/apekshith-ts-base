import express,{Router} from 'express';
import dotenv from 'dotenv';
import * as chat from '../services/openAI/ai'; 
import { entryPoint } from "../middleware/entrypoint";
import { exitPoint } from "../middleware/exitpoint";



const router=Router();

// router.post('/chat/ask',entryPoint,chat.fetchChatCompletion,exitPoint);

export default router;




