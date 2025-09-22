
const mongoose = require('mongoose');
const slugify = require('slugify')
const validator  =require("validator")



const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: [true, 'Name already taken, please another one'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxLength:[40, 'A tour name must have less or equal than 40 characters '],
      // validate:[validator.isAlpha,'Tour Name must only contains characters']
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
      min:[1, 'Rating the must be above 1'],
      max:[5, 'Rating must be below 5']
    },

    ratingsQuantity:{
      type:Number,
      default:0      
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    //IMP
     difficulty: {
      type:String,
      required:[true, 'A tour must have a difficulty'],
      enum:{
        values:['easy',  'medium' , 'difficult'],
        message:'Difficulty is either: easy, medium, difficult'
      }
     },

     //custom validator
    priceDiscount: {
      type:Number,
      validate:{
        validator:function(val){
          //this only points to current doc on NEW document creation.
        return val < this.price  // val here is the priceDiscount
      },
      message:'Discount price should be smaller than the actual price'
    
    }
    },

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
    startDates:[Date],

    secretTour: {
      type:Boolean,
      default:false
    }



  },{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  }

);


tourSchema.virtual('durationWeeks').get(function(){
  return this.duration/7
})


//Document MIDDLEWARE : runs before .save() and .create(). not on update()

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


//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next){
this.find({secretTour:{$ne:true}})
this.start = Date.now()
next()
})


tourSchema.post(/^find/, function(docs,next){
console.log(`Query took ${Date.now()-this.start} milliseconds!`)
next()
})

//Aggregation middleware
tourSchema.pre('aggregate',  function(next){
  this.pipeline().unshift({
    $match:{secretTour:{$ne:true}}})
      next()
})

tourSchema.index({ name: 1 }, { unique: true });

// 🚫 Optional: Add custom validator for friendlier error message
tourSchema.path('name').validate(async function (value) {
  const count = await mongoose.models.Tour.countDocuments({ name: value });
  return count === 0;
}, 'Tour name already exists');

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
