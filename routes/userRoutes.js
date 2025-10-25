const express  =require('express')
const usercontroller = require('../controllers/userController')
const authController = require('../controllers/authController')
const factory = require("../controllers/handlerFactory")
const User = require("../Models/userModels")

const router  =express.Router()






router.post('/signUp' , authController.signUp)
router.post("/login", authController.login)
router.post("/forgotPassword",  authController.forgotPassword)
router.patch("/resetPassword/:token",  authController.resetPassword)


router.use(authController.protect)// all the routes that comes after this middleware will be protected by this middleware

router.get("/me", usercontroller.getMe, usercontroller.getSingleUser)
router.patch("/updateMyPassword",authController.updatePassword)
router.patch("/updateMe", usercontroller.updateMe)
router.delete("/deleteMe",  usercontroller.deleteMe )

router.use(authController.restrictTo('admin'))

router      
.route("/")
.get(usercontroller.getAllUsers)
router
.route("/:id")
.get(usercontroller.getSingleUser)
.patch(usercontroller.updateUser)
.delete(usercontroller.deleteUser)

module.exports = router
