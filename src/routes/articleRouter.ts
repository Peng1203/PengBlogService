import express from 'express'
import ArticleController from '../controllers/articleController'
import { uploadToDisk } from '../middlewares/multer.config'

const router = express.Router()

const articleController = new ArticleController()

router.get('/getArticleList', articleController.getArticleList)

router.get('/articleDetail/:id', articleController.getArticleDetailById)

router.post('/addArticle', articleController.addNewArticle)

router.put('/updateArticleById/:id', articleController.updateArticle)

router.delete('/deleteArticleById/:id', articleController.delArticle)

router.post(
  '/upload-resources',
  uploadToDisk.single('file'),
  articleController.uploadCover
)

export default router
