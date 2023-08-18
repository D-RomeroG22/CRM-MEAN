import mongoose, {Schema,model} from 'mongoose';


const interactionSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:[true,'El ID del usuario es obligatorio en las interacciones']
    },
    description:{
        type: String,
        required: [true,'La descripción de la interacción es obligatoria']
    },
    Date:{
        type: Date,
        default:Date.now()
    },
    isActive:{
        type:Boolean,
        default: true   
    }
});


export default model('Interaction',interactionSchema);