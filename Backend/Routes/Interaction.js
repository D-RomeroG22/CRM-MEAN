import {Router} from 'express';
import { resWithoutData } from '../Helpers/apiResponses.js';

export const interactionRouter = Router();


interactionRouter.get('/',(req,res)=>{
    resWithoutData(200,'GET INTERACTION',res);
});


interactionRouter.post('/',(req,res)=>{
    resWithoutData(200,'POST INTERACTION',res);
});

interactionRouter.delete('/',(req,res)=>{
    resWithoutData(200,'DELETE INTERACTION',res);
});


interactionRouter.put('/',(req,res)=>{
    resWithoutData(200,'PUT INTERACTION',res);
});


interactionRouter.patch('/',(req,res)=>{
    resWithoutData(200,'PATCH INTERACTION',res);
});