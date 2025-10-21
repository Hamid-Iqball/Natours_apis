const mongoose =  require('mongoose')

const reviewSchema =  new mongoose.Schema(
    {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
      trim: true,
      minlength: [10, 'Review must be at least 10 characters']
    },

    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      required: [true, 'Review must have a rating']
    },

    createdAt:{
        type:Date,
        default: Date.now()
    },
  

    //Reference to Tour, In many situation when we do not know how much our Arrays will grow then it is best to implement refrence to the other model
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,"Review must belong to a tour"]
    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, 'Review must belong to user']

        }

    },
    {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)


const Review = mongoose.Model('Review',reviewSchema)
module.exports = Review