import mongoose, {Schema,model} from 'mongoose';


const userSchema = new Schema({
    name:{
        type: String,
        required: [true,'El Nombre es obligatorio']
    },
    lastname:{
        type: String,
        required: [true, 'El Apellido es obligatorio']
    },
    username:{
        type: String
    },
    email:{
        type: String,
        required: [true,'El Email es obligatorio']
    },
    password:{
        type: String,
        required: [true,'La contraseña es obligatoria']
    },
    phone:{
        type:String,
        required:[true,'El Teléfono es obligatorio']
    },
    rol: { 
        type: String
    },
    createdTime: { 
        type: Date, default: Date.now()
    },
    google:{
        type: Boolean, default: false
    },orders:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    Bookings:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ],
    Interactions:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Interaction'
        }
    ], 
    isActive:{
        type: Boolean, default: true
    },
    date:{
        type:String
    }
});


userSchema.methods.toJSON = function (){ 
    const {__v,password,_id,...user} = this.toObject(); //this.toObject() hace referencia a la nueva 
    //inserción que se esté llevando a cabo en la BDD 
    //sacamos la contraseña y con el operador 'rest' metemos el resto de cosas en 'usuario' 
    user.uid = _id;
    return user; //retornamos la variable que no contiene la contraseña
}
//export the user model
export default model('User',userSchema);