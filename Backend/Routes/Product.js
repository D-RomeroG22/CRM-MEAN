import {Router, request} from 'express';
import passport from 'passport';
import { resWithoutData } from '../Helpers/apiResponses.js';
import { postProduct } from '../Controllers/Product.controller.js';
import { validarErrors } from '../Middlewares/express-validator.js';
import validator from 'express-validator';
import { esIdMongoValido } from '../Helpers/db-validators.js';

export const productRouter = Router();


productRouter.get('/',[passport.authenticate('jwtStrategy',{session:false})],(req=request,res=response)=>{
    console.log(req);
    return resWithoutData(200,'GET PRODUCT',res);
});


productRouter.post('/',[
    passport.authenticate('jwtStrategy',{session:false}),
    validator.check('name','El nombre del producto es obligatorio').notEmpty().isString().trim(),
    validator.check('category','El ID de la categoría es obligatorio').notEmpty().trim(),
    validator.check('category','El ID de la categoría debe ser un id de mongoDB').isMongoId(),
    validarErrors],
postProduct);


productRouter.delete('/',(req,res)=>{
    resWithoutData(200,'DELETE PRODUCT',res);
});


productRouter.put('/',(req,res)=>{
    resWithoutData(200,'PUT PRODUCT',res);
});


productRouter.patch('/',(req,res)=>{
    resWithoutData(200,'PATCH PRODUCT',res);
});