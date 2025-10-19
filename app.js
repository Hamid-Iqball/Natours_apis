const express = require("express")
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')


const tourRouter = require("./routes/tourRoutes")
const userRouter = require('./routes/userRoutes')
const AppError =  require("./utils/appError")
const globalErrorHandler = require("./controllers/errorControllers")



const app = express()

//middleware
// this middleware is being used for the development
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}


const limiter = rateLimit({
    max:100,
    windowsMs:60*60*1000,
    message:"Too many requests from this IP, please try again in an hour"
})

app.use('/api/' ,limiter)
app.use(express.json())


app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next()
})



// This is declaring the routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/user', userRouter)

//This is the middleware for the unhandled routes
app.all('*', (req,res,next)=>{
    // res.status(404).json({
    //     status:'Fail',
    //     message:`Can't find ${req.originalUrl} on this server`
    // })

    next(new AppError(`Can't find ${req.originalUrl} on this server` , 404))
})


//Global Error middleware
app.use(globalErrorHandler)
module.exports = app