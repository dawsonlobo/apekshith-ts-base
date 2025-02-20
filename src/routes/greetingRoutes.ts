import express,{Router} from 'express';
import { entryPoint } from "../middleware/entrypoint";
import { exitPoint } from "../middleware/exitpoint";
import * as greetings from "../controller/greetingsController";



const router = express.Router();


router.get("/hello", entryPoint, greetings.greetings,exitPoint);



export default router;