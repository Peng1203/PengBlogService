import express from 'express'
import ArticleController from '../controllers/articleController'

const router = express.Router()

const articleController = new ArticleController()

router.get('/getArticleList', articleController.getArticleList)

router.post('/addArticle', articleController.addNewArticle)

router.put('/updateArticleById/:id', articleController.updateArticle)

router.delete('/deleteArticleById/:id', articleController.delArticle)

export default router
