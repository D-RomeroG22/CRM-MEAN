//Node dependencies 
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//npm Dependencies 
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import passport from 'passport';
import '../Middlewares/passport.js';

//database connection 
import { db_connect } from '../Config/db.js';

//Routes imports
import {userRouter,categoryRouter,productRouter,orderRouter,
bookingRouter,rolRouter, authRouter} from '../Routes/index.js';
import { analyticRouter } from '../Routes/Analytics.js';


class Server {

    constructor(){
        //create server
        this.app = express();
        //Paths for routes
        this.paths = {
          user: "/User",
          category: "/Category",
          product: "/Product",
          booking: "/Booking",
          order:"/Order",
          analytics :"/Analytics",
          rol:"/Rol",
          auth:"/Auth"
        };  
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
        this.app.use(passport.initialize())
    }


    routes(){
        this.app.use(this.paths.user,userRouter);
        this.app.use(this.paths.category ,categoryRouter );    
        this.app.use(this.paths.product,productRouter);
        this.app.use(this.paths.booking,bookingRouter);
        this.app.use(this.paths.order,orderRouter );
        this.app.use(this.paths.analytics,analyticRouter);
        this.app.use(this.paths.rol,rolRouter);
        this.app.use(this.paths.auth,authRouter);
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