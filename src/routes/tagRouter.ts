import express from 'express'
import TagController from '../controllers/tagController'

const router = express.Router()

const tagController = new TagController()

router.get('/getTagList', tagController.getTagList)

router.post('/addTag', tagController.addNewTag)

router.put('/updateTagById/:id', tagController.updateTag)

router.delete('/deleteTagById/:id', tagController.delTag)

export default router
