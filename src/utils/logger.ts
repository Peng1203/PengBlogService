/**
 * 记录 HTPP 请求日志
 * 按照每个月 生成一次新的日志
 * 格式化 日志记录方式
 */
import fs from 'fs'
import path from 'path'
import morgan from 'morgan'
import moment from 'moment'
import { createStream } from 'rotating-file-stream'
import { format } from 'date-fns'

const yearMonth = moment().format('YYYY-MM')
// 日志文件存放路径
// process.env.NODE_ENV === 'development' ?
const logDirectory = path.join(path.join(__dirname, '../logs/'))
// 确保日志文件夹存在
fs.mkdirSync(logDirectory, { recursive: true })
const logFileName = `access_${yearMonth}.log`
// 创建一个新的日志文件流
const accessLogStream = createStream(logFileName, {
  interval: '1M', // 每月创建一个新的日志文件
  path: logDirectory,
})

morgan.token('date', () => format(new Date(), 'yyyy-MM-dd HH:mm:ss'))

// 日志格式化
const logFormat =
  'IP/:remote-addr HTTP/:http-version Method/:method  URL:url  Code/:status  Response_ms/:response-time ms  ResponseTime[:date[iso]]'
const logger = morgan(logFormat, { stream: accessLogStream })

export default logger
