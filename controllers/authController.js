const User = require(".././Models/userModels")
const catchAsync = require("../utils/catchAsync")

exports.signUp = catchAsync(async(req,res,next)=>{
 const user = await User.create(req.body)
 res.status(201).json({
    status:'sucess',
    data:user

 })
}
    
)