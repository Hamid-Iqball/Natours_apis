const fs = require('fs')

//In Node.js, __dirname is a global variable that represents the directory name of the current module (the current file being executed). It gives you the absolute path to the directory where the current script is located.
const tours =JSON.parse( fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))



exports.checkID  =(req,res,next,id)=>{
      if(req.params.id*1>tours.length){
        return res.status(204).send().json({
            status:'fail',
            message:"Invalid ID"
        })
    }
    next()
}

exports.getAllTours =  (req,res)=>{
 res.status(200).json({
    status:'success',
    requestedAt: req.requestTime,
    results:tours.length,
    data:{
        tours
    }
 })
}

exports.createTour =  (req,res)=>{
   
    const newId = tours[tours.length-1].id+1
    const newTour = Object.assign({id:newId}, req.body) //merging two objects
    tours.push(newTour)

    fs.writeFile(
   `${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours),
    err=>{
        res.status(201).json({
            status:"success",
            data:{
                tour:newTour
            }
        })
    }
    )
}

exports.getSingleTour =(req,res)=>{
    const id = req.params.id*1
    const tour = tours.find((el)=>el.id===id)


        res.status(200).json({
        status:'success',
        data:{
            tour
        }
    })
}

//

exports.updateTour = (req,res)=>{
     if(req.params.id>tours.length){
        return res.status(401).json({
            status:'fail',
            message:"Invalid ID"
        })
    }
}


exports.deleteTour = (req,res)=>{
 
    res.status(204).json({
        status:"success",
        data:null
    })
}

