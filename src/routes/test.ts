import express from 'express'
import TestController from '../controllers/testController'
const router = express.Router()

const testController = new TestController()

router.get('/getTestList', testController.getTestList)

router.get('/getTestInfo/:id', testController.getTestInfoByID)

router.post('/post', testController.postTest)

export default router
