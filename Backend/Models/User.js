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
        type: String,
        required: [true,'El Nombre de usuario es obligatorio']
    },
    email:{
        type: String,
        required: [true,'El Email es obligatorio']
    },
    password:{
        type: String,
        required: [true,'La contraseña es obligatoria'],
        minLength: [8,'Contraseña minimo de 8 carácteres']
    },
    phone:{
        type:String,
        required:[true,'El Teléfono es obligatorio'],
        match: [/^[+][0-9]{1,6}([-]?[0-9]+){0,9}[ ]?[0-9]{7,15}$/,'El teléfono SOLO debe contener un prefijo correspondiente al país y números']
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
    bookings:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ],
    isActive:{
        type: Boolean, default: true
    }
});


userSchema.methods.toJSON = function (){ 
    const {__v,password,...user} = this.toObject(); //this.toObject() hace referencia a la nueva 
    //inserción que se esté llevando a cabo en la BDD 
    //sacamos la contraseña y con el operador 'rest' metemos el resto de cosas en 'usuario' 
    return user; //retornamos la variable que no contiene la contraseña
}
//export the user model
export default model('User',userSchema);