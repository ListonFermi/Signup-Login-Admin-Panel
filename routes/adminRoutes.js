const express= require('express')
const adminRouter= express.Router()
const adminController= require('../controller/adminController.js')
const adminAuthentication=require('../controller/authenticationMiddlewares/adminAuthentication.js')

adminRouter.get('/admin', adminController.adminLogin )

adminRouter.post('/adminLogin', adminController.adminVerification )

adminRouter.get('/adminHome', adminController.adminHome)

adminRouter.post('/logout', adminController.adminLogout)

adminRouter.post('/adminHome', adminController.addUser)

adminRouter.post('/searchUser', adminAuthentication, adminController.searchUser )

adminRouter.post('/editUser', adminController.editUser)

adminRouter.get('/editUser', adminController.editUserPage)

adminRouter.get('/deleteUser', adminController.deleteUser)

module.exports= adminRouter