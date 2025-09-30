const User = require(".././Models/userModels")
const catchAsync = require("../utils/catchAsync")

exports.signUp = catchAsync(async(req,res,next)=>{
 const user = await User.Create(req.body)
 res.status(204).json({
    status:'sucess',
    data:user,

 })
}
    
)