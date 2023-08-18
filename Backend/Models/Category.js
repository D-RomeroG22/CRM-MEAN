import mongoose, { Schema, Model } from "mongoose";

const categorySchema = new Schema({

    name:{
        type: String,
        required: [true,'El nombre de la categoría es obligatorio']
    },
    avaible:{
        type: Boolean,
        default: true
    },
    userCreator:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true,'El id del usuario en la categoría es obligatoria']
    },
    creationDate:{
        type: Date,
        default: Date.now()
    }
});

export default Model('Categorie',categorySchema);