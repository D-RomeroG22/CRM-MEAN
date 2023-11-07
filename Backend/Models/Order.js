import mongoose, {Schema,model} from 'mongoose';

const orderSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:[true, 'El ID del usuario en la orden es requerido']
    },
    
    productList:[
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required:[true,'El ID del producto en la orden es requerido']
            },
            amount:{
                type: Number,
                required:[true,'La cantidad del producto es requerida']
            },
            _id: false
        }
    ],
    isActive:{
        type:Boolean,
        default: true
    },
    Date:{
        type: Date,
        default: Date.now()
    },
    status:{
        type : String ,
        default:'PENDIENTE',
        uppercase:true
    }
});


orderSchema.methods.toJSON = function (){ 
    let {__v,isActive,...order} = this.toObject(); //this.toObject() hace referencia a la nueva 
    //inserción que se esté llevando a cabo en la BDD 
    return order; 
}

export default model('Order',orderSchema);