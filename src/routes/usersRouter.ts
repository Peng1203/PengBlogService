import express from 'express'
import UserController from '../controllers/userControlles'

const router = express.Router()

const userController = new UserController()

router.post('/login', userController.userLogin)

router.post('/testData', (req, res, next) => {
  const { sessionID } = req as any
  console.log('sessionID -----', sessionID)

  res.json({
    name: 'zs',
    data: 'test',
  })
})

export default router
