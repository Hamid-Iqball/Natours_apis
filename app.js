const express = require("express")

const morgan = require('morgan')


const tourRouter = require("./routes/tourRoutes")
const userRouter = require('./routes/userRoutes')
const app = express()



//middleware
// this middleware is being used for the development
app.use(morgan('dev'));

app.use(express.json())

app.use((req,res,next)=>{
console.log('Helo from the middleware 👋')
next()
})


app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next()
})






//Routes
//This is Routes mounting






// This is declaring the routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/user', userRouter)

const PORT =3000
app.listen(PORT, ()=>{
    console.log(`Server successfully started at ${PORT}`)
})