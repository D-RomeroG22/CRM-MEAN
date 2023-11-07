import mongoose, {Schema,model} from 'mongoose';


const bookingSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true,'El ID del usuario es requerido en la reserva']
    },

    peopleAmount:{
        type: Number,
        required:[true,'La cantidad de personas es requerida en la reserva']
    },
    isActive:{
        type: Boolean,
        default: true
    },
    Date:{
        type: Date,
        default: Date.now()
    }
});


export default model('Booking',bookingSchema);