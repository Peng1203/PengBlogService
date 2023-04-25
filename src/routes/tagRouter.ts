import express from 'express'
import TagController from '../controllers/tagController'

const router = express.Router()

const tagController = new TagController()

router.get('/tagList', tagController.getTagList)

router.post('/addTag', tagController.addNewTag)

router.put('/updateTagById/:id', tagController.updataTag)

router.delete('/deleteTagById/:id', tagController.delTag)

export default router
