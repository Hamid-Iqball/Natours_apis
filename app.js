const express = require("express")
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const mongoSanitize  =require('express-mongo-sanitize')
const xss = require('xss-clean')




const tourRouter = require("./routes/tourRoutes")
const userRouter = require('./routes/userRoutes')
const AppError =  require("./utils/appError")
const globalErrorHandler = require("./controllers/errorControllers")
const { default: helmet } = require("helmet")



const app = express()


// Globalmiddleware

// Set security HTTP headers
 app.use(helmet())


// this middleware is being used for the development
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

// Limit requests from the same IP
const limiter = rateLimit({
    max:100,
    windowsMs:60*60*1000,
    message:"Too many requests from this IP, please try again in an hour"
})
app.use('/api/' ,limiter)


// Body parser, reading data from the body into req.body
app.use(express.json({limit:'10kb'}))

//Data sanatization against noSql query injection
app.use(mongoSanitize())

//Data santization against XSS
app.use(xss())

//serving static files
app.use(express.static(`${__dirname}/public`))


app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next()
})



// This is declaring the routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/user', userRouter)

//This is the middleware for the unhandled routes
app.all('*', (req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server` , 404))
})


//Global Error middleware
app.use(globalErrorHandler)
module.exports = app