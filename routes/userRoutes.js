const express  =require('express')
const usercontroller = require('../controllers/userController')
const authController = require('../controllers/authController')

const router  =express.Router()

const {getAllUsers , createUser , getUser , updateUser,  deleteUser} = usercontroller



router.post('/singup' , authController.signUp)


router
.route("/")
.get(getAllUsers).post(createUser)


router
.route("/:id")
.get(getUser)
.patch(updateUser)
.delete(deleteUser)

module.exports = router
