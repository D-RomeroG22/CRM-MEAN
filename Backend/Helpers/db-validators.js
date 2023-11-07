import { User,Rol } from "../Models/index.js";
import Mongoose from 'mongoose';


//funciones helper para validaciones y middlewares


//username
const existeUsername=async(username)=>{
    const findUsername = await User.findOne({username});
    if(findUsername){
        return true;
    }
    return false;
}

const existeUsernameMiddleware = async(username)=>{
    if(await existeUsername(username)){
        throw new Error(`El nombre de usuario: '${username}' ya existe`);
    }
}


//email
const existeEmail = async(email)=>{
    const findEmail = await User.findOne({email});
    console.log(findEmail);
    if(findEmail){
        if(findEmail.isActive){
            return true
        }
        return false;
    }
}

const existeEmailMiddleware =async(email)=>{
    if(await existeEmail(email)){
        throw new Error(`El email: '${email}' ya está registrado, use otro`);
    }
}


//phone
const existePhone= async(phone)=>{
    const findPhone = await User.findOne({phone});
    if(findPhone && findPhone.isActive){
        return true
    } return false;
}


//rol
const existeRol = async (name)=>{
    const findRol = await Rol.findOne({name});
    if(!findRol){
        return false;
    }else{
        if(findRol.isActive){return findRol;}else{return false}
    }
}



const existeName = async(name)=>{
    const findName = await User.findOne({name});
    if(findName) return true;
    return false;
}


const existeLastname = async(lastname)=>{
    const findLast = await User.findOne({lastname});
    if(findLast) return true;
    return false;
}

//mongoID
const  esIdMongoValido=(id)=>{
    //definimos una clase de tipo 'ObjectId' con el paquete mongoose (ver importaciones)
    const isObjetctId = Mongoose.Types.ObjectId;
    if(isObjetctId.isValid(id)){ //validamos con 'isValid' si el string tiene las propiedades de un id
        if((String)(new isObjetctId(id)) === id){ //de ser así validamos que el string puede ser un
                                                //id y no solo tiene el largo (12 bytes) de un id
            return true;    //si es así retornamos true y validamos que SI es un id de mongo 
        }else{
            return false; //sino mandamos false porque solo es un string de 12 bytes
        }
    }
    return false; //si ni siquiera es un string de 12 bytes mandamos un false directamente
}

export {
    existeUsername,
    existeEmail,
    existeRol,
    esIdMongoValido,
    existeEmailMiddleware,
    existeUsernameMiddleware,
    existeName,
    existeLastname,
    existePhone
}