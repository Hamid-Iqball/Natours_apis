
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")



//clousers:The inner function will have the access to the variable the outer function


exports.createOne = Model =>catchAsync(async (req,res,next)=>{

    const doc =  await Model.create(req.body)   
            res.status(201).json({
                status:'Success',
                    data:{doc}
                
            })
})








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


exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });



//
exports.getOne = (Model, populateoptions) => catchAsync(async(req,res,next)=>{

  let query =Model.findById(req.params.id)

  if(populateoptions) query= query.populate(populateoptions)
  
 //That's how we populate the refrenece data 
  const doc = await query
  if(!doc){

   return next(new AppError('No document found with this ID', 404))
  }
     res.status(200).json({
        status:"Success",
        data:{
            doc
        }
     })
})



