const { status } = require('express/lib/response')
const Tour = require('./../Models/tourModel')
//In Node.js, __dirname is a global variable that represents the directory name of the current module (the current file being executed). It gives you the absolute path to the directory where the current script is located.
// const tours =JSON.parse( fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))





exports.getAllTours =  async (req,res)=>{

    const tours =  await Tour.find({})
   try{

       res.status(200).json({
           status:'success',
           results:tours.length,
           data:{tours}
           
        })
    } catch(error){
        res.status(500).json({
            status:'error',
            message:'error'
        })
    }
}

exports.createTour = async (req,res)=>{
   
    try{
        const newTour =  await Tour.create(req.body) //Tour.create returns a promise but instead of using then methods we use async await  
        res.status(201).json({
            status:'Success',
            data:{
                tour:newTour
            }
        })
    }catch(error){
      res.status(400).json({
        status:'fail',
        message:"There is an error"
      })
    }
}

exports.getSingleTour =(req,res)=>{
    const id = req.params.id*1
   


        res.status(200).json({
        status:'success',
      
    })
}

//

exports.updateTour = (req,res)=>{
   
    
}


exports.deleteTour = (req,res)=>{
 
    res.status(204).json({
        status:"success",
        data:null
    })
}

