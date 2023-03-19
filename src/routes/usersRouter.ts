import express from 'express'
import UserController from '../controllers/userController'

const router = express.Router()

const userController = new UserController()

router.get('/getCaptcha', userController.getCaptcha)

router.post('/verifyCaptcha', userController.verifyCaptcha)

router.post('/login', userController.userLogin)

router.post('/logout', userController.userLogout)

export default router
