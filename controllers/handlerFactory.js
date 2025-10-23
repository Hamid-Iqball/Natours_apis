const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")



//clousers:The inner function will have the access to the variable the outer function
exports.deleteOne = Model =>catchAsync(async (req,res,next)=>{
    
     const tour = await Model.findByIdAndDelete(req.params?.id)
    
     if(!tour){
       return next(new AppError('No document found with this ID', 404))
      }
    
    
     res.status(204).json({
      status:"success",
      data:null
     })
     
      
    })


    
   