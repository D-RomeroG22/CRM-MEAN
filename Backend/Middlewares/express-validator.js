import { validationResult } from "express-validator";
import { errorHandler } from "../Helpers/apiResponses.js";

const validarErrors = (req,res,next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){ //si tenemos errores en el objeto 
        return errorHandler(400,errors.array(),res); //retornamos un error y los errores en un arreglo en
        //formato JSON
    }
    //! No olvidar poner siempre el 'next()' para seguir en caso de que no hayan errores
   next();
}


export{validarErrors};
