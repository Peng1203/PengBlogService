import express from 'express'
import RoleController from '../controllers/roleController'

const router = express.Router()

const roleController = new RoleController()

router.get('/getRoleList', roleController.getRoleList)

router.post('/addRole', roleController.addRole)

router.delete('/deleteRoleById/:id', roleController.delRole)

router.put('/updateRoleInfoById/:id', roleController.updateRole)

export default router
