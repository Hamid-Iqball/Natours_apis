const Review =require('../Models/reviewModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.getAllReviews = catchAsync(async (req,res,next)=>{
  let filter ={}
  if(!req.params.tourId) filter = {tour:req.params.tourId}
 
    const reviews = await Review.find(filter)
    
    res.status(201).json({
        status:"success",
        reviews:reviews.length,
        data:{
            reviews
        }
    })
})

exports.createReview  = catchAsync(async (req,res,next)=>{

  // Allow nested routes 
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id; // assuming user is logged in

  const review = await Review.create(req.body)

  res.status(201).json({
    status:"success",
    data:{
        review
    }
  })
})