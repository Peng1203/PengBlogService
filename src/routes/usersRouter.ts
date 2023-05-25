import express from 'express'
import UserController from '../controllers/userController'
import { uploadToDisk } from '../middlewares/multer.config'

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

router.patch(
  '/uploadAvatarById/:id',
  uploadToDisk(3, [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/webp',
  ]).single('file'),
  userController.uploadUserAvater
)

router.post('/changePasswordById/:id', userController.changePassword)

router.get('/getAllUserOptions', userController.getAllUserOptions)

export default router
