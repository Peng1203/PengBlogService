import express from 'express'
import CategoryController from '../controllers/categoryController'

const router = express.Router()

const categoryController = new CategoryController()

router.get('/getCategoryList', categoryController.getCategoryList)

router.post('/addCategory', categoryController.addNewCategory)

router.put('/updateCategoryById/:id', categoryController.updateCategory)

router.delete('/deleteCategoryById/:id', categoryController.delCategory)

export default router
