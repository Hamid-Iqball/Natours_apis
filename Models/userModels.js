const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {  // Fixed typo here
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, "A password must have at least eight characters"]  // Fixed validation rule here
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password']
  }
}, { timestamps: true });  // Fixed timestamps option

const User = mongoose.model('User', userSchema);
module.exports = User;
