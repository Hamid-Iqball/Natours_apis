const express = require('express');
const reviewsController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

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
  .delete(
    authController.protect,                 // don’t let randos delete
    authController.restrictTo('admin', 'user'),
    reviewsController.deleteReview)
  .patch(reviewsController.updateReview)


module.exports = router;
