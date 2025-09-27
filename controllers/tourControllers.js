const { status } = require('express/lib/response')
const Tour = require('./../Models/tourModel')
const APIFeatures  = require("./../utils/APIFeatures")
const catchAsync = require("../utils/catchAsync")
//In Node.js, __dirname is a global variable that represents the directory name of the current module (the current file being executed). It gives you the absolute path to the directory where the current script is located.
// const tours =JSON.parse( fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

//This middleware is for the purpose to modify the req or more specifically the route befroe getting all the tours
exports.aliasTopTours = (req,res,next)=>{
  req.query.limit = '5',
  req.query.sort = '-ratingAverage,price',
  req.query.fields = 'name,price,summary, ratingsAverage, diffculty',
  next()
}


exports.getAllTours = catchAsync( async (req,res, next)=>{

    const features = new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().pagination()
    //Execute Query
    const tours = await features.query
    
    res.status(200).json({
      status:'success',
      results:tours.length,
      data:{tours}
      
    })
  
})


exports.createTour = catchAsync(async(req,res,next)=>{
   
    const newTour =  await Tour.create(req.body) //Tour.create returns a promise but instead of using then methods we use async await  
        res.status(201).json({
            status:'Success',
            data:{
                tour:newTour
            }
        })
})

exports.getSingleTour = catchAsync(async(req,res,next)=>{

    const tour = await Tour.findById(req.params.id)
     res.status(200).json({
        status:"Success",
        data:{
            tour
        }
     })
   
   
})

//

exports.updateTour = catchAsync(async(req, res,next) => {
  const tour = await Tour.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, // return the updated doc, not the old one
      runValidators: true, // make mongoose validate before saving
    }
  );

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "No tour found with that ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: { tour },
  });
});



exports.deleteTour = catchAsync(async (req,res,next)=>{

 await Tour.findByIdAndDelete(req.params?.id)
 res.status(204).json({
  status:"success",
  data:null
 })
 
  
})

// Aggregation pipeline
exports.getTourStates = catchAsync(async (req,res,next)=>{

    const states = await Tour.aggregate([
      {
        $match:{ratingsAverage:{$gte:4.5}}
      },
      {
        $group:{
          _id:"$difficulty",
          numTours:{$sum:1},
          numRating:{$sum:'$ratingsAverage'},
          avgRating:{$avg:'$ratingsAverage'},
          avgPrice:{$avg:'$price'},
          maxPrice:{$max:'$price'},
          minPrice:{$min:'$price'},
          
        }
      },
      {
        $sort:{avgPrice:1}
      },
      // {
      //   $match:{_id :{$ne:"easy"}}
      // }
    ]);

    res.status(200).json({
    status:"success",
    data:{states}
  })
  
  
}
)


// Aggregation pipeline: Unwinding
exports.getMonthlyPlan = catchAsync(async (req,res,next)=>{


  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind:'$startDates'
    },
    {
      $match:{
        startDates:{
          $gte: new Date(`${year}-1-1`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },{
      $group:{
        _id: { $month: '$startDates'},
        numTourStarts:{$sum:1},
        tours: {$push:'$name'}
      }
    },
    {
      $addFields :{
        month : '$_id'
      }
    },
    {
      $project:{ // it is used to show or not show tat field, 0 For not shown and 1 for shown.
        _id:0
      }
    },

    {
      $sort:{
        numTourStarts: -1
      }
    }
  ])

  res.status(200).json({
    status:"success",
    data:{plan}
  })
  

})