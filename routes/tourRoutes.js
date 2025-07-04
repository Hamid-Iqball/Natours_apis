const express  = require('express')
const tourController = require("./../controllers/tourControllers")


const router = express.Router()
const {getAllTours , createTour , getSingleTour , updateTour , deleteTour} = tourController


//param middleware to get rid of DRY
router.param('id', (req,res,next,val)=>{
    console.log(` Tour id is ${val}`)
    next()
})

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