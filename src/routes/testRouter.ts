import express from 'express'
import TestController from '../controllers/testController'
import { validate } from 'class-validator'
const router = express.Router()

const testController = new TestController()

router.get('/getTestList', testController.getTestList)

router.get('/getTestInfo/:id', testController.getTestInfoByID)

router.post('/addTestInfo', testController.postTest)

router.put('/updateTestInfo/:id', testController.updateTestInfoByID)

router.delete('/delTetsInfo', testController.deleteTestInfoByID)

router.get('/getToken', testController.generateToken)

router.post('/validateToken', testController.validateToken)

export default router
