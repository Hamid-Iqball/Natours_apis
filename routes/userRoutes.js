const express  =require('express')
const usercontroller = require('../controllers/userController')
const authController = require('../controllers/authController')

const router  =express.Router()

const {getAllUsers , createUser , getUser , updateUser,  deleteUser} = usercontroller



router.post('/signUp' , authController.signUp)
router.post("/login", authController.login)

router.post("/forgotPassword",  authController.forgotPassword)
router.patch("/resetPassword/:token",  authController.resetPassword)
router.patch("/updateMyPassword",authController.protect, authController.updatePassword)
router.patch("/updateMe",authController.protect, usercontroller.updateMe)
router.delete("/deleteMe", authController.protect,  usercontroller.deleteMe )


router
.route("/")
.post(createUser)
.get(authController.protect,getAllUsers)
router
.route("/:id")
.get(getUser)
.patch(updateUser)
.delete(authController.protect,
      authController.restrictTo('admin' , 'lead-guide'), 
      deleteUser)

module.exports = router
