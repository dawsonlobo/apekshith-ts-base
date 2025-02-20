import express,{Router} from 'express';
import * as users from "../controller/userController"
import { entryPoint } from "../middleware/entrypoint";
import { exitPoint } from "../middleware/exitpoint";



const router=Router();

router.post('/user/add',entryPoint,users.addUser,exitPoint);

export default router;