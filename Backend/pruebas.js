import 'dotenv/config';
import moment from 'moment';
import { Order } from './Models/index.js';
import { db_connect } from './Config/db.js';
moment.locale('es');

const prueba = async()=>{

    try {
        let user = '64ea696e2d08656b45c48bed';
        await db_connect();
        const order = await Order.find({isActive:false,user});
        console.log(order);
    } catch (error) {
        PromiseRejectionEvent(error);
    }
    
}


prueba().then().catch(error=>console.log(error));






const fecha = moment().format('Do MMMM YYYY');

const format = 'YYYY-MM-DD';
// Crear un objeto Moment
const fechaMoment = moment('2023-08-14',format);

// Convertirlo a objeto Date
const fechaDate = fechaMoment.toDate();

const fechaPrueba = '2023-08-14';

const date = Date.parse(fechaPrueba);
        // await db_connect();
        // let idUser = '64ea696e2d08656b45c48bed';
        // let orders = await Order.find({ isActive: true, user:idUser});
    
        // console.log(orders);