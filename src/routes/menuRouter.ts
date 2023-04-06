import express from 'express'
import MenuController from '../controllers/menuController'

const router = express.Router()

const menuController = new MenuController()

router.get('/getMenuList', menuController.getMenuList)

export default router
