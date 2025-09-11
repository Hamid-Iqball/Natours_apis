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
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
  },
  {
    strict: true, // Ignore fields not in schema
  }
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
