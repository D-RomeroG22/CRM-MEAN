import {Router} from 'express';
//controller
import { deleteByAdmin, deleteUser, getAllUsers, getUser, patchUser, patchUserByAdmin, postUser } from '../Controllers/User.controller.js';
import  validator from 'express-validator';
import { existeUsername, existeEmail, existeEmailMiddleware } from '../Helpers/db-validators.js';
import { validarErrors } from '../Middlewares/express-validator.js';
import passport from 'passport';

export const userRouter = Router();


userRouter.get('/',getAllUsers);
userRouter.get('/:id',[validator.check('id').isMongoId(),validarErrors],getUser);


userRouter.post('/',[validator.check('username','El username es obligatorio').notEmpty(),
                    validator.check('name','El nombre es obligatorio').notEmpty(),
                    validator.check('lastname','El apellido es obligatorio').notEmpty(),
                    validator.check('email','El email es obligatorio').notEmpty(),
                    validator.check('email','Correo inválido, digite uno nuevo').isEmail(),
                    validator.check('phone','El teléfono es obligatorio').notEmpty(),
                    validator.check('username').custom(existeUsername),
                    validator.check('email').custom(existeEmailMiddleware),
                    validarErrors],
postUser);

                    
userRouter.patch('/',[passport.authenticate('jwtStrategy',{session:false})],patchUser);                   
userRouter.patch('/:id',[passport.authenticate('jwtStrategy',{session:false})],patchUserByAdmin);


userRouter.delete('/',[passport.authenticate('jwtStrategy',{session:false})],deleteUser);
userRouter.delete('/:id',[passport.authenticate('jwtStrategy',{session:false})],deleteByAdmin);



