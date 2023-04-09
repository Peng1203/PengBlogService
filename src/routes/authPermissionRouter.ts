import express from 'express'
import AuthPermissionController from '../controllers/authPermissionController'

const router = express.Router()

const authPerController = new AuthPermissionController()

router.get('/getAuthPermissionList', authPerController.getAuthPermissionList)

router.post('/addAuthPermission', authPerController.addAuthPermission)

export default router
