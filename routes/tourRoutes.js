const express  = require('express')
const tourController = require("./../controllers/tourControllers")


const router = express.Router()
const {getAllTours , createTour , getSingleTour , updateTour , deleteTour} = tourController


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