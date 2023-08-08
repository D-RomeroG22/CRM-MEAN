import { Schema,model } from "mongoose";


const contactSchema = new Schema({

    name:{
        type: String,
        required:[true,'El nombre del contacto es obligatorio']
    },
    description:{
        type:String,
        required:[true,'La descripción del contacto es obligatoria']
    },
    phone:{
        type:String,
        required:[true,'El Teléfono del contacto es obligatorio']
    },
    organization:{
        type:String,
        required:false
    },
    assignedTo:{ 
        type: String, ref: 'User', required: true 
    },
    creator:{ 
        type: String, default: 'admin' 
    },
    address:{ 
        type: String, required: false 
    },

});