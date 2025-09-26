module.exports = (fn)=>{
  //Return it so that we can have access to the req,res etc
  return (req,res,next)=>{
    fn(req,res,next).catch(err=>next(err)) //The error will propagate to the error handling middleware
  }
}