const jwt = require('jsonwebtoken')
const User = require(".././Models/userModels")
const catchAsync = require("../utils/catchAsync")
const AppError = require('../utils/appError')


const signInToken = id =>{
    const token  = jwt.sign(
      { id },                // 1 payload
      process.env.JWT_SECRET,             // 2️ secret key
      { expiresIn: process.env.JWT_EXPIRES_IN } // 3️ options
  )
}

exports.signUp = catchAsync(async(req,res,next)=>{
   const newUser = await User.create({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      passwordConfirm:req.body.passwordConfirm
   })
   
  const token  = signInToken(newUser._id)


 res.status(201).json({
    status:'sucess',
    token:token,
    data:{
      user:newUser
}
 })
}  
)


exports.login =catchAsync(async(req,res,next)=>{
   const {email,password} = req.body

   // 1) Check if email and passwords exists,
   if(!email || !password){
      new AppError("Please provide email and passwords", 400)
   }

   // 2) Check if user exists && password is correct, we have not shown the password but here we need it so this is what we are gonna do.

   const user = await User.findOne({email}).select('+password')

   if(!user || !(await user.correctPassword(password, user.password))){ 
      return new AppError("Incorrecr emial or password", 401)
   }
   const token  = signInToken(user._id)


   // 3) IF everything is ok, send token to the client.

   res.status(200).json({
      status:'success',
      token
   })
})