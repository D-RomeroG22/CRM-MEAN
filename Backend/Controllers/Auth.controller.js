import {response, request} from 'express';
import bcrypt from 'bcrypt';
import { User } from '../Models/index.js';
import { resWithData, resWithoutData } from '../Helpers/apiResponses.js';
import { generarJWT } from '../Helpers/generarJWT.js';

const loginUser = async(req=request, res=response)=>{
    const {username,password} = req.body;
    const candidates = await User.find({username,isActive:true});
    if(candidates.length>0){
       let user;
        for (let index = 0; index < candidates.length; index++) {
            if(candidates[index].isActive){
                user = candidates[index];
                break;
            }
        }
        if(user!=null){
            const verifyPass = bcrypt.compareSync(password,user.password);
            if(verifyPass){
                const token = await generarJWT(user._id);
                return resWithData(200,'Logeado',`Bearer ${token}`,res);

            }else return resWithoutData(401,'Contraseña inválida, intete nuevamente',res);
        }else{
        return resWithoutData(401,`No existe un usuario con el siguiente nombre de usuario: ${username}`,res);
        }
    }else{
        return resWithoutData(401,`No existe una cuenta con el siguiente nombre de usuario: ${username}`,res);
    }
}

export {
    loginUser
}