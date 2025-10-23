const express  = require('express')
const tourController = require("./../controllers/tourControllers")
const authController = require("./../controllers/authController")
const reviewRouter = require("./../routes/reviewRoutes")


const router = express.Router()
const {getAllTours , createTour , getSingleTour , updateTour , deleteTour} = tourController




//param middleware to get rid of DRY
// router.param('id', checkID)


//nested routes, 
//POST/tour/234fad4/reviews, did a blody error here
// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview)

router.use("/:tourId/reviews", reviewRouter) //mounting the router


router.route('/tour_Stats').get(tourController.getTourStates)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router.route("/top-5-cheap").get(tourController.aliasTopTours, tourController.getAllTours)

router
.route('/')
.get(getAllTours)
.post(createTour)
router
.route('/:id')
.get(getSingleTour)
.patch(updateTour)
.delete(authController.protect ,authController.restrictTo('admin'), deleteTour)



module.exports = router