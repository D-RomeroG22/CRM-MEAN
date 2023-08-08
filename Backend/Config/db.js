import db from 'mongoose';
import 'dotenv/config';


const db_connect = async()=>{
    const dbURL = process.env.MONGO_CONECTION;
    try {
        await db.connect(dbURL);
        console.log('Database ON');
    } catch (error) {
        console.log('Error database connection: ',error);
    }
}


export{db_connect}