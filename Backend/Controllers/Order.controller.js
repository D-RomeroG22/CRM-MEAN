import { request, response } from "express";
import {
  errorHandler,
  resWithData,
  resWithoutData,
} from "../Helpers/apiResponses.js";
import { Category, Product, Order, User } from "../Models/index.js";
import { esIdMongoValido } from "../Helpers/db-validators.js";
import moment from "moment";

const getAllOrder = async (req = request, res = response) => {
  let { to = 5, from = 0 } = req.query;
  let {user} = req;
  let idUser;
  if(user.rol == 'ADMIN' && req.body.id!=undefined){
    idUser = req.body.id;
    if(!esIdMongoValido(idUser))return resWithoutData(400,'El ID proporcionado NO es un id de mongoDB, intente nuevamente',res);
  }else{
    idUser = user._id;
  }
  to = Number(to);
  from = Number(from);

  if (isNaN(to)) {
    to = 5;
  }
  if (isNaN(from)) {
    from = 0;
  }

  let [totalDocs, orders] = await Promise.all([
    Order.countDocuments({ isActive: true,user:idUser }),
    Order.find({ isActive: true, user:idUser})
      .skip(from)
      .limit(to)
      .populate({
        path: "user",
        match: { isActive: true },
        select: ["username", "email", "phone", "rol"],
      })
      .populate({
        path: "productList.product",
        select: "name",
      }),
  ]);

  const data = {
    totalDocs,
    orders,
  };

  return resWithData(200, "Ordenes Actuales del usuario solicitado:", data, res);
};

const getOrder = async (req = request, res = response) => {
  const { id } = req.params;
  const {user} = req;
  const order = await Order.findById(id)
    .populate({
      path: "user",
      match: { isActive: true },
      select: ["username", "email", "phone", "rol"],
    })
    .populate({
      path: "productList.product",
      select: "name",
    });

  if (order && order.isActive){
    if(user.rol =='USER' && user._id != order.user._id.toString()) return resWithoutData(400,'La orden NO corresponde al usuario actual, DENEGADO',res);
    return resWithData(200, "Orden Encontrada", order, res);
  }
  return resWithoutData(400,"Orden NO encontrada, ID incorrecto ó Orden eliminada",res);
};

const postOrder = async (req = request, res = response) => {
  let { user: uid, productList } = req.body;

  let user = await User.findById(uid);
  if (!user) return resWithoutData(400, "El Usuario NO existe", res);

  //hacemos limpieza, para quedarnos con un arreglo de SOLO objetos
  //para ello solo nos quedamos con los elementos que tengan las propiedades productList y amount
  productList = productList.filter((object) => {
    return (
      typeof object == "object" &&
      object.hasOwnProperty("id") &&
      object.hasOwnProperty("amount")
    );
  });

  productList = await Promise.all(
    productList.map(async (object) => {
      try {
        //verificar si existe un producto por ID
        let productListupp = await Product.findById(object.id);
        if (productListupp) {
          //verificamos que la cantidad sea un número:
          if (typeof object.amount == "number") {
            return object;
          } else return object.id;
          //si existe, retornamos el producto como venía (objeto)
        } else {
          //sino, retornamos solo el id
          return object.id;
        }
      } catch (error) {
        return error;
      }
    })
  );

  for (let i = 0; i < productList.length; i++) {
    //validamos si algún producto vino sin encontrar
    if (typeof productList[i] !== "object") {
      return resWithoutData(
        400,
        `Orden errónea, 'id' ó 'amount' incorrectas}`,
        res
      );
    }
  }

  try {
    //Vamos a guardar una nueva orden:
    let newOrder = new Order({
      user: uid,
      productList: productList,
    });
    newOrder.save();
    let idOrder = newOrder._id;

    //guardamos la orden del usuario:
    await User.findByIdAndUpdate(uid, { $push: { orders: idOrder } });
    return resWithData(
      201,
      "Orden creada y usuario actualizado",
      newOrder,
      res
    );
  } catch (error) {
    return errorHandler(500, error, res);
  }
};


const patchOrder = async (req = request, res = response) => {
  /*
    condiciones de uso: 

    -si vamos a editar un producto, nos mandará el mismo id con diferente cantidad, 
    -si quiere eliminarlo, mandará el id del producto y una cantidad de 0,
    -si quiere añadir otro producto, mandará un id no existente previamente
    -Los usuarios SOLO puede editar una orden propia, y no la de alguien más,
    los admins pueden editar ordenes de otr@s
  */
  try{

    
    let { user } = req;
    let { id: idOrder } = req.params;
    let order = await Order.findOne({ _id: idOrder });
    if (!order || !order.isActive) return resWithoutData(400, "Orden inválida o eliminada", res);
    
    if (user.rol == "USER") {
      if (user._id != order.user.toString())return resWithoutData(200,"La orden solicitada no pertenece al usuario actual, DENEGADO",res);
    }

    let { productList, date, status } = req.body;
    if (date) {
      let validate = Date.parse(date);
      if (!isNaN(validate)) {
        order.Date = new Date(date);
      } else {return resWithoutData(400,'El campo "Date" no corresponde a una fecha, intente nuevamente',res);}
    }

    if (productList) {
        if (!Array.isArray(productList))return resWithoutData(400,'El campo "productList" debe ser un array de objetos, intente nuevamente',res);
        productList = productList.filter((object) => {
            return (
            typeof object == "object" &&
            object.hasOwnProperty("product") &&
            object.hasOwnProperty("amount")
            );
        });

        if (productList.length <= 0)return resWithoutData( 400,"Los productos no cumplen las condiciones de uso (un id mongo y una cantidad), intente nuevamente",res);
      
        for (const object of productList) {
            if (!esIdMongoValido(object.product)) {
                return resWithoutData(400, "El id de uno de los productos es inválido, intente nuevamente", res);
            }
            if (typeof object.amount !== "number") {
                return resWithoutData(400, "La cantidad de un producto es inválida, debe ser un número, intente nuevamente", res);
            }
        }

        if(order.productList.length>0){
          console.log(order.productList.length);
            for (let i = 0; i < productList.length; i++) {
                for (let j = 0; j < order.productList.length; j++){
                if (order.productList[j].product.toString() == productList[i].product) {
                    if (productList[i].amount == 0){
                    order.productList.splice(j,1);
                    }else{
                    order.productList[j].amount = productList[i].amount;
                    }
                    j=order.productList.length;
                }else if(j == order.productList.length - 1 && productList.amount != 0){
                    order.productList.push(productList[i]);
                }
                }
            }
        }else{
          productList = productList.filter((object) => object.amount > 0);
          order.productList = productList;
        }
    }

    if (status) {
        let permited = ["PENDIENTE,COMPLETADA"];
        if (typeof status == "string") {
          status = status.toUpperCase();
          if (permited.includes(status)) {
            order.status = status;
          } else {
            return resWithData(400,"El status NO es válido, intente nuevamente",res);
          }
        } else {
          return resWithData(400,"El status debe ser un texto, intente nuevamente",res);
        }
      }

      await order.save();
      return resWithData(200, "Orden actualizada", order, res);
  }catch(error){
      return errorHandler(500,error,res);
  }
}


const deleteOrder = async(req=request,res=response)=>{
  try {
   
    const {user} = req;
    let {id:orderId} = req.params;
    
    let order = await Order.findById(orderId).select('user isActive');
    if(user.rol == 'USER'){
      if(user._id != order.user.toString())return resWithoutData(400,'La orden solicitada NO corresponde al usuario actual, DENEGADO',res);
    }

    if(!order.isActive || !order) return resWithoutData(400,'Orden inválida o eliminada',res);

    order.isActive = false;
   
    await order.save();

    return resWithoutData(200,'La orden fue eliminada exitosamente',res);
  }catch (error) {
    return errorHandler(500,error,res);
  }
    
}

export { getAllOrder, getOrder, postOrder, patchOrder,deleteOrder };
