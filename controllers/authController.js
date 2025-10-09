const jwt = require('jsonwebtoken')
const {promisify}  =require('util')
const User = require(".././Models/userModels")
const catchAsync = require("../utils/catchAsync")
const AppError = require('../utils/appError')
const { isFloatLocales } = require('validator')
const sendEmail = require('../utils/email')


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
      passwordConfirm:req.body.passwordConfirm,
      passwordChangedAt:req.body.passwordChangedAt,
      role:req.body.role
   })
   
  const token  = signInToken(newUser._id)


 res.status(201).json({
    status:'sucess',
    token:token,
    data:{
      user:newUser
}
 })
})


exports.login = catchAsync(async (req, res, next) => {
   const { email, password } = req.body;

   // 1) Check if email and password exist
   if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
   }

   // 2) Check if user exists & password is correct (confirm password)
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


// Autentication algorithm

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and checking if it’s there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access', 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 404));
  }

  // 4) Check if user changed password after the token was issued
  if(currentUser.changedPasswordAfter(decoded.iat)){
   return next(new AppError("User recently changed password! please login again", 401))
  }
  // 5) Grant access to protected route
  req.user = currentUser;
  next();
});



//We can not pass aruments in middleware directly so we wrape the whole middleware into another function and return that middleware then.
exports.restrictTo = (...roles)=>{
   return (req,res,next)=>{
      if(!roles.includes(req.user.role)){ //['admin' , 'lead-guide'] not inclued 'user"
         return next(new AppError("You do not have permission to perform this action"), 403)
      }

      next()
   }
} 




//forgot password functionlity

exports.forgotPassword = catchAsync(async(req,res,next)=>{

   //1) Get User based posted email
   const user = await User.findOne({email:req.body.email})
   if(!user){
      return next(new AppError("There is no user with this email address"), 404)
   }

   //2) Generate the random reset token
   const resetToken  = user.createPasswordResetToken()
   await user.save({validateBeforeSave:false});

   //3) Send it to user's email
   const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

   const message =`Forgot your password? Submit a PATCH request with your new password and passwordConfirm to  :${resetURL}.\nIf your didn't forget your password, Please ignore this email!`;

  try{
   
     
     await sendEmail({
        email:user.email,
        subject:'Your password reset token (valid for 10mins)',
        message
      })
      
      console.log('Email sent successfully to:', user.email);
      res.status(200).json({
         status:'success',
         message:'Token sent to your email!'
      })
   }catch(err){
      console.error('Email sending error:', err);
      user.passwordResetToken = undefined;
      user.passwordResetExpires=undefined;
       await user.save({validateBeforeSave:false});

       return next(new AppError('There was an error sending email. Try again later.', 500))
   }


})



exports.resetPassword = catchAsync(async(req,res,next)=>{


})