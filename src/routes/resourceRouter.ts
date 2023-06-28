import express from 'express'
import ResourceController from '../controllers/resourceController'

const router = express.Router()

const resourceController = new ResourceController()

router.get('/getDirectory', resourceController.getDirectory)

router.get('/albumCatalog', resourceController.getAlbumCatalog)

router.delete('/remove', resourceController.removeFileOrDir)

export default router
