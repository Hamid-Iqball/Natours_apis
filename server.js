const mongoose = require('mongoose')
const dotenv  = require('dotenv')
const app =  require('./app')

dotenv.config({path:'./config.env'})

const DB = process.env.DATABASE

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false

}).then((con)=>{
    console.log(con.connection)
    console.log("DB CONNECTIONS")
})
//In this file we will add the stuff that is not related to the express and is mainly related to the server


const PORT =process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server successfully started at ${PORT}`)
})

