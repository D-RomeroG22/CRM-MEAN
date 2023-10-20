import {Router} from 'express';
import { resWithoutData } from '../Helpers/apiResponses.js';
import { postOrder } from '../Controllers/Order.controller.js';
import validator from 'express-validator';
import { validarErrors } from '../Middlewares/express-validator.js';

export const orderRouter = Router();


orderRouter.get('/',(req,res)=>{
    resWithoutData(200,'GET ORDER',res);
});


orderRouter.post('/',[validator.check('user','El id del usuario es obligatorio y debe ser un id de mongo')
                                    .isMongoId().notEmpty(),
                     validator.check('products','Los productos deben venir en un array').notEmpty().isArray(),               
                    validarErrors],postOrder);

orderRouter.delete('/',(req,res)=>{
    resWithoutData(200,'DELETE ORDER',res);
});


orderRouter.put('/',(req,res)=>{
    resWithoutData(200,'PUT ORDER',res);
});


orderRouter.patch('/',(req,res)=>{
    resWithoutData(200,'PATCH ORDER',res);
});