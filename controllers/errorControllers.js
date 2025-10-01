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
  console.log(err);
  const field = Object.keys(err.keyValue)[0]; // Get the field name (e.g., 'email', 'username')
  const value = Object.values(err.keyValue)[0]; // Get the duplicate value (e.g., 'example@gmail.com')
  const message = `${field} (${value}) already exists. Please use another ${field}.`;
  return new AppError(message, 400);
};


const handleValidateErrorDB = (err)=>{

  const errors  = Object.values(err.errors).map(el=>el.message)
  const message = `Invalidate Input data ${errors.join(',')}`
  return new AppError(message,400)
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
    if(error.code===11000) error = handleDuplicateFieldsDB(error);
    if(error.name==='ValidationError') error = handleValidateErrorDB(error)

    sednErrorProd(error, res);
  }
};
