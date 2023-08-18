import moment from 'moment';
moment.locale('es');

const fecha = moment().format('Do MMMM YYYY');

const format = 'YYYY-MM-DD';
// Crear un objeto Moment
const fechaMoment = moment('2023-08-14',format);

// Convertirlo a objeto Date
const fechaDate = fechaMoment.toDate();

const fechaPrueba = '2023-08-14';
