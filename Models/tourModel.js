const mongoose = require('mongoose');
const slugify = require('slugify')
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: [true, 'Name already taken, please another one'], // 👉 create a unique index at DB level
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
    },
    slug: String,
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
     difficulty: String,
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
      default:Date.now(),
      select:false
    },
    startDates:[Date]



  },{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  }

);


tourSchema.virtual('durationWeeks').get(function(){
  return this.duration/7
})


//Document MIDDLEWARE : runs before .save() and .create().

tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower:true})
  next()
})


// tourSchema.pre('save', function(next){
// console.log('Will save document...')
// next() 
// })


// tourSchema.post('save', function(doc,next){
//   console.log(doc)
//   next()
// })

tourSchema.index({ name: 1 }, { unique: true });

// 🚫 Optional: Add custom validator for friendlier error message
tourSchema.path('name').validate(async function (value) {
  const count = await mongoose.models.Tour.countDocuments({ name: value });
  return count === 0;
}, 'Tour name already exists');

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
