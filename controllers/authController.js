const jwt = require('jsonwebtoken')
const {promisify}  =require('util')
const User = require(".././Models/userModels")
const catchAsync = require("../utils/catchAsync")
const AppError = require('../utils/appError')


const signInToken = id =>{
    const token  = jwt.sign(
      { id },                // 1 payload
      process.env.JWT_SECRET,             // 2️ secret key
      { expiresIn: process.env.JWT_EXPIRES_IN } // 3️ options
  )
  return token
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


exports.login = catchAsync(async (req, res, next) => {
   const { email, password } = req.body;

   // 1) Check if email and password exist
   if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
   }

   // 2) Check if user exists & password is correct
   const user = await User.findOne({ email }).select('+password');

   if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
   }

   // 3) If everything is ok, send token
   const token = signInToken(user._id);

   res.status(200).json({
      status: 'success',
      token
   });
});


// 

exports.protect = catchAsync(async function(req,res,next){
   // 1) Getting token and check if it's there
 
   let token;
   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer '))
   {
      token = req.headers.authorization.split(" ")[1]
   }

   if(!token){
      new AppError('You are not logged in! please log in get access', 401)
   }

   // 2) Verification token
   const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
   console.log(decode)
   //3) Check if user still exists

   // 4) Check if user changes password after the token was issued


   next()
})