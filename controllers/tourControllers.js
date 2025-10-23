const { status } = require('express/lib/response')
const Tour = require('./../Models/tourModel')
const APIFeatures  = require("./../utils/APIFeatures")
const catchAsync = require("../utils/catchAsync")
const AppError = require('../utils/appError')
const factory = require("./handlerFactory")
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


exports.createTour = factory.createOne(Tour)
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)
// exports.getSingleTour = factory.getOne(Tour, {path:'reviews'})
exports.getSingleTour = factory.getOne(Tour, { path: 'reviews'});



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