import {response,request} from 'express';
import { Category } from '../Models/index.js';
import { errorHandler, resWithData, resWithoutData } from '../Helpers/apiResponses.js';

const postCategory= async(req=request,res=response)=>{
    //Si entro al controlador es porque el usuario ya se validó que exista con el passport
    let {name} = req.body;
    let {user} = req;

    try {
        let valCat = await Category.findOne({name:name.toUpperCase()});
        if(valCat) return resWithoutData(400,`Ya existe una categoria llamada ${name}`);
        
        const newCat = new Category({
            name,
            userCreator:user._id
        });

        await newCat.save();
        return resWithData(201,'Categoría creada',newCat,res);
    } catch (error) {
        return errorHandler(400,error,res);
    }

}


export{
    postCategory
}