// 用于实现 接收的文件写入到本地的 中间件
import path from 'path'
import multer from 'multer'
import { Request } from 'express'

// 配置上传
const storage = multer.diskStorage({
  // 上传文件的目录
  destination(req: Request, file, cb): void {
    // console.log('file -----', file)
    const SAVE_PATH = path.join(__dirname, '..', 'public/upload')
    cb(null, SAVE_PATH)
  },
  // 上传文件的名称
  filename(req: Request, file, cb): void {
    // 解决中文名乱码的问题
    file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8")
    cb(null, file.originalname)
  }
})
// multer 配置
const upload = multer({ storage })
// 调用 upload.single('file')
export default upload