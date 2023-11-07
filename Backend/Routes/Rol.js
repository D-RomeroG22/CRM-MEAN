import {request,response} from 'express';
import { Router } from 'express';
import validator from 'express-validator';
import {postRol} from '../Controllers/Rol.controller.js';
import { validarErrors } from '../Middlewares/express-validator.js';
export const rolRouter = Router(); 

// rolRouter.get('/',[
//         //TODO middleware
// ],getRol);


rolRouter.post('/',[
    validator.check('name','El Rol es obligatorio').notEmpty(),
    validarErrors],postRol);

// rolRouter.patch('/',[],patchRol);

// rolRouter.delete('/',[],deleteRol);


