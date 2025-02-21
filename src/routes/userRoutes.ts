import express,{Router} from 'express';
import * as users from "../controller/userController"
import { entryPoint } from "../middleware/entrypoint";
import { exitPoint } from "../middleware/exitpoint";
import passport from '../passport/newpassport';


const router=Router();

router.post('/user/add',entryPoint,users.addUser,exitPoint);

router.post('/user/login',entryPoint,users.login,exitPoint);


router.get('/user/greet',entryPoint,passport.authenticate("bearer", { session: false }),users.greet,exitPoint);



export default router;