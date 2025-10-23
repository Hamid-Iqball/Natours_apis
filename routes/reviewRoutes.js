const express =  require('express')
const reviewsController = require('./../controllers/reviewController')
const authController = require("./../controllers/authController")

const router = express.Router({mergeParams:true})



router.route('/')
.get(reviewsController.getAllReviews)
.post( authController.protect,
     authController.restrictTo('user'), reviewsController.createReview)

router.route("/:id")
     .delete(reviewsController.deleteReview)
     .patch(reviewsController.updateReview)
module.exports = router