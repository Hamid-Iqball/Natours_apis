const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
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
    required: [true, 'Please confirm your password'],
    //This only works on Create and Save 
   validate:{ validator:function(el){
      return el===this.password
    }, message:'Passwords are not the same!'}
  }
}, { timestamps: true });  // Fixed timestamps option

userSchema.pre('save',async function(next){
  //Only run this function if password was actually modified
  if(!this.isModified('password')) return next()

    //Hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12)

    //Delete password confirm field
    this.passwordConfirm = undefined
    next()
})


const User = mongoose.model('User', userSchema);
module.exports = User;
