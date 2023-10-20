import {Router} from 'express';
import { resWithoutData } from '../Helpers/apiResponses.js';

export const bookingRouter = Router();


bookingRouter.get('/',(req,res)=>{
    resWithoutData(200,'GET BOOKING',res);
});


bookingRouter.post('/',(req,res)=>{
    resWithoutData(200,'POST BOOKING',res);
});

bookingRouter.delete('/',(req,res)=>{
    resWithoutData(200,'DELETE BOOKING',res);
});


bookingRouter.put('/',(req,res)=>{
    resWithoutData(200,'PUT BOOKING',res);
});


bookingRouter.patch('/',(req,res)=>{
    resWithoutData(200,'PATCH BOOKING',res);
});