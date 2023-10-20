import jwt from 'jsonwebtoken';
import 'dotenv/config';

const generarJWT = (uid)=>{
    return new Promise((res,rej) => {
        const payload = {_id:uid};
        jwt.sign(payload,process.env.JWT,
            {
                expiresIn: '1d'
            },(err,token)=>{
                if(err){
                    console.log(err);
                    rej('No se puede generar el token')
                }else{
                    res(token);
                }
            })
            //la función recibe 4 parámetros, el payload,
        //una llave secreta, las opciones y un callback para procesar los resultados

        //? las opciones se pueden configurar para dar una fecha de expiración
            //? se debe poner el tiempo en dígitos con su unidad de medida 'hora:h' 'minutos:m' 'seg:s' 
                //? por ejemplo '3d', por defecto si no ponemos nada serían milisegundos '200' = 200ms
        //? La llave secreta debemos cuidarla siempre para que nadie pueda firmar JWT sin autorización
   
    });
}

export{ 
    generarJWT
}