import {Router} from 'express';
import validator from 'express-validator';
import { validarErrors } from '../Middlewares/express-validator.js';
import { loginUser } from '../Controllers/Auth.controller.js';



export const authRouter = Router();

authRouter.post('/',[validator.check('username','el username es obligatorio').notEmpty(),
                    validator.check('password','La contraseña es obligatoria').notEmpty(),
                    validarErrors]
                    ,loginUser);