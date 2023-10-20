import {Schema,model} from 'mongoose';

const productSchema = new Schema({

    name:{
        type:String ,
        required: [true,'El nombre del producto es requerido'],
        uppercase:true
    },
    description:{
        type:String
    },
    avaible:{
        type:Boolean,
        default:true
    },
    category:{
        type : Schema.Types.ObjectId, ref:'Categorie',
        required: [true,'El ID de la categoría es obligatoría'],

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

export default model('Product',productSchema);