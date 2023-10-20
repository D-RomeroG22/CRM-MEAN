import {response} from 'express';



const resWithoutData = (status = 200,msg,res=response)=>{
    return res.status(status).json({
        msg
    });
}


const errorHandler = (status=400,error,res=response)=>{
    let errorInfo;
    (error.message) ? errorInfo = error.message : errorInfo = error;
    
    return res.status(status).json({
        errorInfo
    });
}


const resWithData = (status=200,msg,data,res=response)=>{

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