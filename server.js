const dotenv  = require('dotenv')
const app =  require('./app')

dotenv.config({path:'./config.env'})

//In this file we will add the stuff that is not related to the express and is mainly related to the server


const PORT =process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server successfully started at ${PORT}`)
})

