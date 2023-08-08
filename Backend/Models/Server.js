//Node dependencies 
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//npm Dependencies 
import express from 'express';
import 'dotenv/config';
import cors from 'cors';

//database connection 
import { db_connect } from '../Config/db.js';

class Server {

    constructor(){
        //create server
        this.app = express();
        //Paths for routes
        this.paths = {};
        //sv port
        this.port = process.env.PORT || 3000;

        //sv settings
        this.settings();
        //sv middlewares
        this.middlewares();
        //sv routes
        this.routes();


        //DB connection
        this.db();
    }

    settings(){
        this.app.set('case sensitive routing',true);
        this.app.disable('x-powered-by');
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname,'../../Public')));
    }


    routes(){

    }


    async db(){
        await db_connect();
    }




    listen(){
        this.app.listen(this.port,()=>{
            console.log('Server ON in port: ',this.port);
        });
    }
}


export default Server;