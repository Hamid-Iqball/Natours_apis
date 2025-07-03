const express = require("express")
const fs = require("fs")
const morgan = require('morgan')


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
//In Node.js, __dirname is a global variable that represents the directory name of the current module (the current file being executed). It gives you the absolute path to the directory where the current script is located.
const tours =JSON.parse( fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))



//Users

const getAllUsers = (req,res)=>{
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })

}


const createUser = (req,res)=>{
 res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}

const getUser = (req,res)=>{
 res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}


const updateUser = (req,res)=>{
 res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}


const deleteUser = (req,res)=>{
 res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}



//Routes
//This is Routes mounting
const tourRouter = express.Router()
const userRouter  =express.Router()



userRouter
.route("/")
.get(getAllUsers).post(createUser)


userRouter
.route("/:id")
.get(getUser)
.patch(updateUser)
.delete(deleteUser)

// This is declaring the routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/user', userRouter)

const PORT =3000
app.listen(PORT, ()=>{
    console.log(`Server successfully started at ${PORT}`)
})