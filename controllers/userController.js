const User = require("../Models/userModels")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")


const filterObj = (obj, ...allowedFields)=>{
    const newObj = {}
  Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el)) newObj[el] = obj[el]
  })
    return newObj
}

exports.getAllUsers =catchAsync( async(req,res,next)=>{
    const users = await User.find()
    res.status(200).json({
        status:'success',
        results:users.length,
        data:{
            users
        }
    })
})
 // this is for the currently authenticated user
exports.updateMe = catchAsync(async(req,res,next)=>{
    //1) Create an error if the user is updating the password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError("This route is not for the password updates, please use /updateMyPassword",400))
    }

    //Filtered the unwanted field name that are not allowed to be updated
    const filterBody = filterObj(req.body, 'name', 'email');

    //2) Update the user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody,{
        runValidators:true, new:true
    })

    res.status(200).json({
        status:"sccess",
        data:{
        user:updatedUser
        }
    })
})


//deactivate user

exports.deleteMe  =catchAsync(async (req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id, {active:false})

    res.status(204).json({
        status:'success'
    })
})
exports.createUser = (req,res)=>{
 res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}
exports. getUser = (req,res)=>{
 res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}


exports.updateUser = (req,res)=>{
 res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}


exports.deleteUser = (req,res)=>{
 res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}