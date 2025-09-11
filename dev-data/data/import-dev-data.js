const fs = require('fs')
const mongoose = require('mongoose')
const dotenv  = require('dotenv')
const Tour = require("../../Models/tourModel")


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

//Read JSON FILE

const tours =JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

//IMPORT DATA INTO DB
const importData  = async ()=>{
    try {
        await Tour.create(tours)
        console.log('Data successfully loaded!')
    } catch (error) {
        console.log(error)
    }
}


//DELETE ALL DATA FROM DB

const deleteTour = async ()=>{
    try {
        await Tour.deleteMany()
        console.log('Data successfully Deleted!')
    } catch (error) {
        console.log(error)
    }
    process.exit()
}


if(process.argv[2]==='--import'){
    importData();
}else if (process.argv[2]==='--delete'){
    deleteTour()
}