import {request, response} from 'express';
import { errorHandler, resWithData, resWithoutData } from '../Helpers/apiResponses.js';
import { Category, Product } from '../Models/index.js';



const postProduct = async(req=request,res=response)=>{

    let {user} = req;
    let {category,name,desc} = req.body;

    try {
        let valCat = await Category.findById(category);
        console.log(valCat);
        if(!valCat || !valCat.avaible) return resWithoutData(400,'La categoría NO existe o fue eliminada',res);
        let valName = await Product.findOne({name:name.toUpperCase()});
        if(valName) return resWithoutData(400,`El Producto '${name}' YA existe en la BDD`,res);
        if(!desc) desc = 'Producto del café';
        const product = new  Product ({
            name,
            description:desc,
            userCreator: user._id,
            category
        });

        await product.save();
        return resWithData(201,'Producto creado',product,res);
    } catch (error) {
        return errorHandler(400,error,res);
    }
}


export{
    postProduct
}