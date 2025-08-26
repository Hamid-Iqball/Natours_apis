const mongoose = require('mongoose')
const dotenv  = require('dotenv')
const app =  require('./app')
const { type } = require('express/lib/response')

dotenv.config({path:'./config.env'})

const DB = process.env.DATABASE

// mongoose.connect(DB,{
mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false

}).then(()=>{
    
    console.log("DB connections successfull!")
})





const PORT =process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server successfully started at ${PORT}`)
})

