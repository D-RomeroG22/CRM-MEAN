import {Schema, model} from 'mongoose';

const rolSchema = new Schema({
    name:{
        type: String,
        required: [true,'El Nombre del Rol es obligatorio'],
        uppercase:true
    },
    isActive:{
        type: Boolean,
        default: true
    }
});


export default model('Rol',rolSchema);