import express from 'express'
import UserController from '../controllers/userController'
import { uploadToRAM } from '../middlewares/multer.config'

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

router.patch('/uploadAvatarById/:id', uploadToRAM.single('file'), userController.uploadUserAvater)

export default router
