import express from 'express'
import RoleController from '../controllers/roleController'

const router = express.Router()

const roleController = new RoleController()

router.get('/getRoleList', roleController.getRoleList)

router.post('/addRole', roleController.addRole)

export default router
