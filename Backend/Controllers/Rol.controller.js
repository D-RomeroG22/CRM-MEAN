import { Rol } from "../Models/index.js";
import {response, request} from 'express';
import { errorHandler, resWithData, resWithoutData } from '../Helpers/apiResponses.js';
import { existeRol } from '../Helpers/db-validators.js';

const postRol = async(req=request,res=response)=>{
    const {name} = req.body;
    let rolCandidate = await existeRol(name);
    if(rolCandidate){
        return resWithoutData(409,"El Rol ya está creado",res);
    }else{  
       try {
           rolCandidate = new Rol({
               name
           });
           await rolCandidate.save();
           
           return resWithData(201,"Rol Creado",rolCandidate,res);
       } catch (error) {
        return errorHandler(500,error,res);
        }   
    }

}


export {
    postRol
}