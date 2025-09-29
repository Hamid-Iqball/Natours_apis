const AppError = require("../utils/appError")

const sendErrorDev = (err,res)=>{
 res.status(err.statusCode).json({
            status:err.status,
            message:err.message,
            stack:err.stack,
            error:err
        })
}

const sednErrorProd = (err,res)=>{
        //Operational Error: Trusted Errors , send message to the  client
        if(err.isOperational){
            res.status(err.statusCode).json({
                status:err.status,
                message:err.message,
                
            })
        }else{
            //Programming error or other unknown error
            console.log('Error 🐦‍🔥' ,err)
            res.status(500).json({
                status:'error',
                message:'Somethinng went wrong'
            })
        }
}

const handleCastErrorDB = (err)=>{
const message = `Invalid ${err.path}: ${err.value}`
return new AppError(message, 400)
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // ✅ preserve message/name so custom handlers work
    let error = {...err}

    error.message = err.message;
    error.name = err.name
    

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    sednErrorProd(error, res);
  }
};
