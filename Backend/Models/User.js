import mongoose, {Schema,model} from 'mongoose';


const userSchema = new Schema({
    name:{
        type: String,
        required: [true,'El Nombre es obligatorio']
    },
    username:{
        type: String,
        required: [true, 'El username es obligatorio']
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
    }
    ,
    isAdmin: { 
        type: Boolean, default: false 
    },
    rol: { 
        type: String, 
        required:true 
    },
    createdTime: { 
        type: Date, default: new Date() 
    },
    google:{
        type: Boolean, default: false
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