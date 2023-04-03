// 用于实现 接收的文件写入到本地的 中间件
import path from 'path'
import multer from 'multer'
import { Request } from 'express'

// 配置上传
const storageToDisk = multer.diskStorage({
  // 上传文件的目录
  destination(req: Request, file, cb): void {
    // console.log('file -----', file)
    const SAVE_PATH = path.join(__dirname, '..', 'public/upload')
    cb(null, SAVE_PATH)
  },
  // 上传文件的名称
  filename(req: Request, file, cb): void {
    // 解决中文名乱码的问题
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8'
    )
    cb(null, file.originalname)
  },
})
// multer 上传到本地的资源服务 配置
export const uploadToDisk = multer({ storage: storageToDisk })
// 调用 uploadToDisk.single('file')

// 使用内存暂存文件
const storageToRAM = multer.memoryStorage()
// 上传文件暂存到内存中 用于获取buffer 并存储到数据库中 当调用 req.file.buffer 则释放内存中的文件
export const uploadToRAM = multer({ storage: storageToRAM })
// 调用 uploadToRAM.single('file')
