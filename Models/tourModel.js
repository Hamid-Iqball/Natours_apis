const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: [true, 'Name already taken, please another one'], // 👉 create a unique index at DB level
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
    },
    duration:{
    type:Number,
    required:[true,'A tour must have a duration']
    },

    maxGroupSize:{
      type:Number,
      required:[true, "A tour must have a group size"]
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
    },

    ratingsQuantity:{
      type:Number,
      default:0      
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priveDiscount: Number,

    summary:{
      type:String,
      required:[true,'A tour must have a description' ],
      trim:true
    },

    description:{
      type:String,
      trim:true
    },

    imageCover:{
      type:String,
      required:[true, 'A tour must have a cover image']
    },

    images:[String],

    createdAt:{
      type:Date,
      default:Date.now()
    },

    starteDate:[Date]

  },

);

// 🔒 Ensure indexes are built (so unique actually works)
tourSchema.index({ name: 1 }, { unique: true });

// 🚫 Optional: Add custom validator for friendlier error message
tourSchema.path('name').validate(async function (value) {
  const count = await mongoose.models.Tour.countDocuments({ name: value });
  return count === 0;
}, 'Tour name already exists');

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
