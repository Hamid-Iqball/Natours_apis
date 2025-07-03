const express  = require('express')

const router = express.Router()
const getAllTours =  (req,res)=>{
 res.status(200).json({
    status:'success',
    requestedAt: req.requestTime,
    results:tours.length,
    data:{
        tours
    }
 })
}

const createTour =  (req,res)=>{
   
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

const getSingleTour =(req,res)=>{
    const id = req.params.id*1
    const tour = tours.find((el)=>el.id===id)

    if(id>tours.length){
        return res.status(401).json({
            status:'fail',
            message:"Invalid ID"
        })
    }

        res.status(200).json({
        status:'success',
        data:{
            tour
        }
    })
}

//

const updateTour = (req,res)=>{
     if(req.params.id>tours.length){
        return res.status(401).json({
            status:'fail',
            message:"Invalid ID"
        })
    }
}


const deleteTour = (req,res)=>{
   if(req.params.id>tours.length){
        return res.status(204).send().json({
            status:'fail',
            message:"Invalid ID"
        })
    }

    res.status(204)
}




router
.route('/')
.get(getAllTours)
.post(createTour)
router
.route('/:id')
.get(getSingleTour)
.patch(updateTour)
.delete(deleteTour)


module.exports = router