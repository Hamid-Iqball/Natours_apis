const express = require("express")
const morgan = require('morgan')
const tourRouter = require("./routes/tourRoutes")
const userRouter = require('./routes/userRoutes')



const app = express()

//middleware
// this middleware is being used for the development
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));

}

app.use(express.json())

app.use((req,res,next)=>{
console.log('Helo from the middleware 👋')
next()
})


app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next()
})



// This is declaring the routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/user', userRouter)


module.exports = app