import {Router} from 'express';
import { resWithoutData } from '../Helpers/apiResponses.js';
import validator from 'express-validator';
import passport from 'passport';
import { validarErrors } from '../Middlewares/express-validator.js';
import { postCategory } from '../Controllers/Category.controller.js';

export const categoryRouter = Router();


categoryRouter.get('/',(req,res)=>{
    resWithoutData(200,'GET CATEGORY',res);
});

//TODO Verificar funcionamiento del passport
categoryRouter.post('/',[
    passport.authenticate('jwtStrategy',{session:false}),
    validator.check('name','El nombre de la categoría es obligatorio').notEmpty(),
    validarErrors],postCategory);

categoryRouter.delete('/',(req,res)=>{
    resWithoutData(200,'DELETE CATEGORY',res);
});


categoryRouter.put('/',(req,res)=>{
    resWithoutData(200,'PUT CATEGORY',res);
});


categoryRouter.patch('/',(req,res)=>{
    resWithoutData(200,'PATCH CATEGORY',res);
});