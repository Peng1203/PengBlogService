// 用于实现 接收的文件写入到本地的 中间件
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { Request } from 'express'
import { STATIC_RESOURCE_ROOT_PATH } from '../configs/sign'

// 配置上传
const storageToDisk = multer.diskStorage({
  // 上传文件的目录
  destination(req: Request, file: any, cb: Function): void {
    // resource-classification 资源分类
    // resource-type 资源类型
    // 根据前端传递的 resource-classification 选择不同的存放目录
    // console.log('file -----', file)

    let SAVE_PATH = ''
    switch (req.headers['resource-classification']) {
      // 文章封面存放路径
      case 'cover':
        SAVE_PATH = path.join(STATIC_RESOURCE_ROOT_PATH, 'cover')
        file.dir = 'cover'
        break
      // 文章引用资源存放路径
      case 'content':
        SAVE_PATH = path.join(STATIC_RESOURCE_ROOT_PATH, 'content')
        file.dir = 'content'
        break
      default:
        SAVE_PATH = path.join(STATIC_RESOURCE_ROOT_PATH, 'upload')
        break
    }
    // console.log('SAVE_PATH -----', SAVE_PATH)
    if (fs.existsSync(SAVE_PATH)) return cb(null, SAVE_PATH)

    // 当文件夹不存在时自动创建
    try {
      fs.mkdirSync(SAVE_PATH, { recursive: true })
      cb(null, SAVE_PATH)
    } catch (e) {
      cb(e)
    }
  },
  // 上传文件的名称
  filename(req: Request, file, cb): void {
    // 解决中文名乱码的问题
    // file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    // console.log('file.originalname -----', file.originalname)
    cb(null, file?.originalname)
  },
})
// multer 上传到本地的资源服务 配置
export const uploadToDisk = multer({
  storage: storageToDisk,
  // 设置字符编码为 UTF-8
  // encoding: 'utf-8',
})
// 调用 uploadToDisk.single('file')

// 使用内存暂存文件
const storageToRAM = multer.memoryStorage()
// 上传文件暂存到内存中 用于获取buffer 并存储到数据库中 当调用 req.file.buffer 则释放内存中的文件
export const uploadToRAM = multer({
  storage: storageToRAM,
  limits: { fileSize: 1024 * 1024 * 4 },
})
// 调用 uploadToRAM.single('file')
