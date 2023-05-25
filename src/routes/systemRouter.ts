import express from 'express'
import SystemController from '../controllers/systemController'

const router = express.Router()

const systemController = new SystemController()

router.post('/update/admin-web', systemController.updateAdminWeb)

export default router
