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
        error_description:error
      })
    }
}

exports.getSingleTour = async(req,res)=>{
   try {
    const tour = await Tour.findById(req.params.id)
     res.status(200).json({
        status:"Success",
        data:{
            tour
        }
     })
   } catch (error) {
    res.status(404).json({
        status:"fail",
        message:error

    })

   }
}

//

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,          // return the updated doc, not the old one
        runValidators: true // make mongoose validate before saving
      }
    );

    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "No tour found with that ID"
      });
    }

    res.status(200).json({
      status: "success",
      data: { tour }
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};



exports.deleteTour = async (req,res)=>{
 try {
 await Tour.findByIdAndDelete(req.params?.id)
 res.status(204).json({
  status:"success",
  data:null
 })
 } catch (error) {
  res.status(404).json({
    stat:"fail",
    message:error
  })
 }
  
}

