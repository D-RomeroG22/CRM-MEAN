import mongoose, {Schema,model} from 'mongoose';

const productSchema = new Schema({

    name:{
        type:String ,
        required: [true,'El nombre del producto es requerido']
    },
    description:{
        type:String,
        required:[true,'La descripción del producto es requerida']
    },
    avaible:{
        type:Boolean,
        default:true
    },
    userCreator:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true,'El ID del cliente en producto es obligatoria']
    },
    creationDate:{
        type: Date,
        default: Date.now()
    }

});

export default model('Product',userSchema);