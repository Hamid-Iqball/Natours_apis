const AppError = require("../utils/appError")

const sendErrorDev = (err,res)=>{
 res.status(err.statusCode).json({
            status:err.status,
            error:err,
            message:err.message,
            stack:err.stack,
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

const handleDuplicateFieldsDB = (err) => {
  console.log(err)
  const value = Object.values(err.keyValue)[0];
  const message = `${value} already exists. Please use another name!`;
  return new AppError(message, 400);
};



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

    if(error.code===11000) error = handleDuplicateFieldsDB(error)

    sednErrorProd(error, res);
  }
};
