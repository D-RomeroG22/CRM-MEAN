import {request, response} from 'express';
import { errorHandler, resWithData, resWithoutData } from '../Helpers/apiResponses.js';
import { Category, Product, Order, User } from '../Models/index.js';
import { esIdMongoValido } from '../Helpers/db-validators.js';




const postOrder = async(req=request,res=response)=>{
    let {user:uid,products} = req.body;

    let  user = await User.findById(uid);
    if(!user)return resWithoutData(400,'El Usuario NO existe',res);

    //hacemos limpieza, para quedarnos con un arreglo de SOLO objetos 
    products = products.filter(object => {
        return typeof object == 'object' && 
        object.hasOwnProperty('product') && 
        object.hasOwnProperty('amount')    
    }); 

    products = await Promise.all(products.map(async (object) =>{
       try {
            //verificar si existe un producto por ID
           let productSupp = await Product.findById(object.product);
           if(productSupp){
            //si existe, retornamos el producto como venía (objeto)
            return object
           }else{
            //sino, retornamos solo el id 
            return object.product
           };
       } catch (error) {
        return error;
       } 
    }));

    for (let i = 0; i < products.length; i++) {
        //validamos si algún producto vino sin encontrar
        if(typeof products[i] !== "object"){
            return resWithoutData(400,`Orden errónea, producto NO encontrado con el id: ${products[i]}`,res);
        }
    }

    try {
        //Vamos a guardar una nueva orden:
        let newOrder = new Order({
            user: uid,
            productList:products
        });
        newOrder.save();
        let idOrder = newOrder._id;
        
        //guardamos la orden del usuario:
        await User.findByIdAndUpdate(uid,{$push:{orders:idOrder}});
        return resWithData(201,'Orden creada y usuario actualizado',newOrder,res);
    } catch (error) {
        return errorHandler(500,error,res);
    }
}

export{
    postOrder
}