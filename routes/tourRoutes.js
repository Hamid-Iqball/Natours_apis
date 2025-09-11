const express  = require('express')
const tourController = require("./../controllers/tourControllers")


const router = express.Router()
const {getAllTours , createTour , getSingleTour , updateTour , deleteTour} = tourController




//param middleware to get rid of DRY
// router.param('id', checkID)

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