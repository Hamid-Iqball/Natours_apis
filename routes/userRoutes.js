const express  =require('express')
const usercontroller = require('../controllers/userController')
const authController = require('../controllers/authController')
// const factory = require("../controllers/handlerFactory")

const router  =express.Router()






router.post('/signUp' , authController.signUp)
router.post("/login", authController.login)

router.post("/forgotPassword",  authController.forgotPassword)
router.patch("/resetPassword/:token",  authController.resetPassword)
router.patch("/updateMyPassword",authController.protect, authController.updatePassword)
router.patch("/updateMe",authController.protect, usercontroller.updateMe)
router.delete("/deleteMe", authController.protect,  usercontroller.deleteMe )


router
.route("/")
// .post(usercontroller.createUser)  // commented out - function not implemented
.get(authController.protect,usercontroller.getAllUsers)
router
.route("/:id")
// .get(usercontroller.getUser)  // commented out - function not implemented
.patch(usercontroller.updateUser)
.delete(authController.protect,
      authController.restrictTo('admin' , 'lead-guide'), 
      usercontroller.deleteUser)  // commented out - function not implemented

module.exports = router
