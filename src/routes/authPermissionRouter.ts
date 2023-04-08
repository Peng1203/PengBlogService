import express from 'express'
import AuthPermissionController from '../controllers/authPermissionController'

const router = express.Router()

const authPerController = new AuthPermissionController()

router.get('/getAuthPermissionList', authPerController.getAuthPermissionList)

export default router
