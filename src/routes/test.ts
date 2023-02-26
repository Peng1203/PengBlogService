import express from 'express'
import TestController from '../controllers/testController'
const router = express.Router()

const testController = new TestController()

router.post('/post', testController.postTest)

export default router
