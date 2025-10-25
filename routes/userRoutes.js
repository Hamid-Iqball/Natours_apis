const express  =require('express')
const usercontroller = require('../controllers/userController')
const authController = require('../controllers/authController')
const factory = require("../controllers/handlerFactory")
const User = require("../Models/userModels")

const router  =express.Router()






router.post('/signUp' , authController.signUp)
router.post("/login", authController.login)


router.get("/me", authController.protect, usercontroller.getMe, usercontroller.getSingleUser)
router.post("/forgotPassword",  authController.forgotPassword)
router.patch("/resetPassword/:token",  authController.resetPassword)
router.patch("/updateMyPassword",authController.protect, authController.updatePassword)
router.patch("/updateMe",authController.protect, usercontroller.updateMe)
router.delete("/deleteMe", authController.protect,  usercontroller.deleteMe )


router
.route("/")

.get(authController.protect,usercontroller.getAllUsers)
router
.route("/:id")
.get(usercontroller.getSingleUser)
.patch(usercontroller.updateUser)
.delete(authController.protect,
      authController.restrictTo('admin' , 'lead-guide'), 
      usercontroller.deleteUser)

module.exports = router
