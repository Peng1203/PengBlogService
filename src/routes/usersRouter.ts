import express from 'express'
import UserController from '../controllers/userController'

const router = express.Router()

const userController = new UserController()

router.get('/getCaptcha', userController.getCaptcha)

router.post('/verifyCaptcha', userController.verifyCaptcha)

router.post('/login', userController.userLogin)

router.post('/logout', userController.userLogout)

router.get('/getUserList', userController.getUserList)

router.get('/getUserInfo/:id', userController.getUserInfo)

router.post('/addUser', userController.addUser)

router.delete('/deleteUserById/:id', userController.delUser)

router.put('/updateUserInfoById/:id', userController.updateUserInfo)

export default router
