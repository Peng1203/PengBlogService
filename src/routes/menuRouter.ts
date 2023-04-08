import express from 'express'
import MenuController from '../controllers/menuController'

const router = express.Router()

const menuController = new MenuController()

router.get('/getMenuList', menuController.getMenuList)

router.post('/addMenu', menuController.addMenu)

router.delete('/deleteMenuById/:id', menuController.delMenu)

router.put('/updateMenuById/:id', menuController.updateMenu)

export default router
