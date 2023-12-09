const express= require('express')
const userRouter= express.Router()
const userController= require('../controller/userController.js')

userRouter.get('/', userController.userLogin)

userRouter.post('/signup', userController.userSignup)

userRouter.post('/login', userController.userVerification )

userRouter.get('/home', userController.userHome)

userRouter.get('/logout', userController.userLogout)

module.exports= userRouter