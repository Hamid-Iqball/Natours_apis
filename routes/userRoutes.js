const express  =require('express')
const usercontroller = require('../controllers/userController')

const router  =express.Router()

const {getAllUsers , createUser , getUser , updateUser,  deleteUser} = usercontroller



router
.route("/")
.get(getAllUsers).post(createUser)


router
.route("/:id")
.get(getUser)
.patch(updateUser)
.delete(deleteUser)

module.exports = router
