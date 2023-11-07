import {Router} from 'express';
import { resWithoutData } from '../Helpers/apiResponses.js';
import { deleteOrder, getAllOrder, getOrder, patchOrder, postOrder } from '../Controllers/Order.controller.js';
import validator from 'express-validator';
import { validarErrors } from '../Middlewares/express-validator.js';
import passport from 'passport';

export const orderRouter = Router();


orderRouter.get('/:id',[passport.authenticate('jwtStrategy',{session:false}),
                        validator.check('id','El ID de la orden No corresponde a un ID de mongoDB').notEmpty().isMongoId(),
                       validarErrors],getOrder);

orderRouter.get('/',[passport.authenticate('jwtStrategy',{session:false})],getAllOrder);

orderRouter.post('/',[validator.check('user','El id del usuario es obligatorio y debe ser un id de mongo')
                                    .isMongoId().notEmpty(),
                     validator.check('products','Los productos deben venir en un array').notEmpty().isArray(),               
                     validarErrors],postOrder);

orderRouter.patch('/:id',[passport.authenticate('jwtStrategy',{session:false}),
                                             validator.check('id','El ID a buscar es inválido').notEmpty().isMongoId(),
                                            validarErrors],patchOrder);

orderRouter.delete('/:id',[passport.authenticate('jwtStrategy',{session:false}),
                                validator.check('id','El ID a buscar es inválido').notEmpty().isMongoId(),
                                validarErrors],deleteOrder);

