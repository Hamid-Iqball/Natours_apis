const express = require('express');
const reviewsController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });


router.use(authController.protect)

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authController.protect,                 // must set req.user first
    authController.restrictTo('user'),      // then check role
    reviewsController.setTourUserIds,       // then derive tour/user ids
    reviewsController.createReview
  );

router
  .route('/:id')
  .get(reviewsController.getSingleReview)
  .delete(            // don’t let randos delete
    authController.restrictTo('admin', 'user'),
    reviewsController.deleteReview)
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewsController.updateReview)


module.exports = router;
