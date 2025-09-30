const validator  =  require('validator')



const mongoose = requrie("mongoose")

const userSchema =new mongoose.schema({

    name:{
        type:String,
        requried:[true,'Please tell us your name']
    },
    emial:{
        type:String,
        required:[true ,'Please provide your email' ],
        unique:true ,
        lowercase:true,
        validate:[validator.isEmail, 'Please proivde a valid email']
        
    },
    photo:String,
    password:{
        type:String,
        requried:[true, 'Please provide a password'],
        minLength:[3,"A password have atleast eight characters"]
    },
    passwordConfirm:{
        type:password,
        requried:[true , 'Please confirm your password']
    }
})


const User = mongoose.model('user', userSchema) 
module.exports = User