import {response} from 'express';



const resWithoutData = (res=response,status = 200,msg)=>{
    return res.status(status).json({
        msg
    });
}


const errorHandler = (res=response,status=400,error)=>{
    let errorInfo;
    (error.message) ? errorInfo = error.message : errorInfo = error;
    
    return res.status(status).json({
        errorInfo
    });
}


const resWithData = (res=response,status=200,msg,data)=>{

    return res.status(status).json({
        msg,
        data
    });
}





export{
    resWithoutData,
    resWithData,
    errorHandler
}