import {request, response} from 'express';
import { errorHandler, resWithData, resWithoutData } from '../Helpers/apiResponses.js';
import { Order, Rol,User,Product } from '../Models/index.js';
import { existeEmail, existeLastname, existeName, existePhone, existeRol, existeUsername } from '../Helpers/db-validators.js';
import bcrypt from 'bcrypt';

const getAllUsers = async(req=request,res=response)=>{
    let {to = 5, from = 0} = req.query;

    to = Number(to);
    from = Number(from);

    if(isNaN(to)){
        to = 5;
    }
    if(isNaN(from)){
        from = 0;
    }

    let [totalDocs,users] = await Promise.all([
        User.countDocuments({isActive:true}),
        User.find({isActive:true}).skip(from).limit(to)
        .populate({
            path:'orders',
            match:{isActive:true},
            select:["productList","Date","status"],
            populate:{
                path:'productList.product',
                select:'name',
            }
        })
    ]);

    const data = {
        totalDocs,
        users
    }
    try {
    return resWithData(200,'usuarios',data,res);
        
    } catch (error) {
        return errorHandler(500,error,res);
    }
}

const getUser = async(req=request, res=response)=>{
    const {id} = req.params;
    try {
        const user = await User.findById(id).populate({
            path:'orders',
            match:{isActive:true},
            select:["productList","Date","status"],
            populate:{
                path:'productList.product',
                select:["name"]
            }
        });
        if(!user) throw new Error(`No existe el usuario con id ${id}`);

        return resWithData(200,'Usuario encontrado',user,res);


    } catch (error) {
        return errorHandler(400,error,res);
    }
}

const  postUser = async(req=request,res=response)=>{
    let {name,lastname,email,password,phone,username,rol} = req.body;
    
    try {
        const salt = bcrypt.genSaltSync(10);
        if(rol){
            let findRol = await existeRol(rol.toUpperCase());
            if(!findRol)return resWithoutData(400,`El Rol ${rol} no existe en la BDD ó fue eliminado`,res);
            rol = rol.toUpperCase();
        }else{
            rol = 'USER'; //este será el rol por defecto si no se manda
        }
        const newUser = new User({
            name,
            lastname, 
            email:email.toLowerCase(), 
            password: bcrypt.hashSync(password,salt), 
            phone, 
            username,
            rol
        });

        await newUser.save();
        return resWithData(201,'Usuario creado',newUser,res);
            
              

    } catch (error) {
        return errorHandler(500,error,res);
    }
    

}

const patchUser= async(req=request,res=response)=>{
    /*
    todo además de eso, utilizar el passport en los endpoints y validar el rol de quien manda el token
    */

    let {name,lastname,username,email,phone} = req.body;
    let {user} = req;
    let update = {}; 
    let regex = new RegExp("^$");
    let emailregex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    let phoneregex = new RegExp("^[+][0-9]{1,6}([-]?[0-9]+){0,9}[ ]?[0-9]{7,15}$");

    if(typeof name =='string' && !regex.test(name)){
        if(! await existeName(name)){
            update.name =name
        }else{
            return resWithoutData(400,`El nombre "${name}" ya está en uso, cámbielo`,res);
        }
    }

    if(typeof lastname =='string' && !regex.test(lastname)){
        if(!await existeLastname(lastname)){
            update.lastname =lastname
        }else{
            return resWithoutData(400,`El apellido "${lastname}" ya está en uso, cámbielo`,res);
        }
    }

    if(typeof username =='string' && !regex.test(username)){
        if(!await existeUsername(username)){
            update.username =username
        }else{
            return resWithoutData(400,`El nombre de usuario "${username}" ya está en uso, cámbielo`,res);
        }
    }

    if(typeof email =='string' && emailregex.test(email)){
        if(!await existeEmail(email)){
            update.email =email
        }else{
            return resWithoutData(400,`El email '${email}' ya está en uso, cámbielo`,res);
        }
    }

    if(typeof phone =="string" && phoneregex.test(phone)){
        if(!await existePhone(phone)){
            update.phone = phone;
        }else{
            return resWithoutData(400,`El teléfono '${phone}' ya está en uso, cámbielo`,res);
        }
    }

    try {
        if(Object.keys(update).length>0){
            await User.findByIdAndUpdate(user._id,update);
            const updated = await User.findById(user._id).select('name lastname username email phone');
            console.log(updated);
            return resWithData(203,`Usuario Actualizado`,updated,res)
        }else{
            return resWithoutData(400,'No hay información para actualizar',res);
        }
    } catch (error) {
        return errorHandler(500,error,res);
    }

    
}


const patchUserByAdmin=async (req=request,res=response)=>{
    let {user} = req;
    if(user.rol == 'USER'){
        return resWithoutData(400,`El usuario NO cuenta con rol de administrador ó está desactivado, denegado`,res);
    }
    const {id} = req.params;
    user = await User.findById(id).select('name lastname rol isActive email username');
    if(user && user.isActive){
        req.user = user;
        return await patchUser(req,res)
    }else{
        return resWithoutData(400,`NO existe un usuario con el id: '${id}'`,res);
    }

}

const deleteUser = async(req =request,res=response)=>{
    let {user} = req;
    if(user && user.isActive){
        user = await User.findByIdAndUpdate(user._id,{isActive:false}).select('name lastanme username email phone isActive');
        const {isActive,...userDeleted} = user;
        console.log(user);
        console.log(userDeleted);
        return resWithData(200,'Solicitud completa, Usuario Eliminado',userDeleted,res);
    }else{
        return resWithoutData(400,'El Usuario es inválido o ya fué eliminado',res);
    }
}

const deleteByAdmin = async(req=request,res=response)=>{
    const {user:admin} = req;
    if(admin && admin.isActive){
        if(admin.rol != 'ADMIN') return resWithoutData(400,'El solicitante NO cuenta con rango de administrador',res);
        const {id} =req.params
        const user = await User.findById(id).select('name lastanme email phone isActive');
        req.user = user;
        return await deleteUser(req,res);
    }else return resWithoutData(400,'La cuenta usada está deshabilitada o fué eliminada, contacte soporte',res);
}


export{
    getUser,
    getAllUsers,
    postUser,
    patchUser,
    patchUserByAdmin,
    deleteUser,
    deleteByAdmin
};
