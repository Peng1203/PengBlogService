import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import _logger from './utils/logger'
import _moment from './utils/moment'
import _env from './utils/environment'
import indexRouter from './routes/indexRouter'
import testRouter from './routes/testRouter'
import usersRouter from './routes/usersRouter'
import notFoundMiddleware from './middlewares/404Middleware'
import errorHandler from './middlewares/errorHandler'
import convertNumber from './middlewares/convertNumber'
import authMiddleware from './middlewares/authMiddleware'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, './public')))
// 记录 HTTP请求 日志
app.use(_logger)
// 将全局通用的库 或者函数 注册到 res 响应对象上
app.use(_moment)
// 将环境变量 设置到 res 响应对象上
app.use(_env)
// 数字字符串转换为Number 类型中间件
app.use(convertNumber)

app.use(authMiddleware)
// 定义路由
app.use('/', indexRouter)
app.use('/test', testRouter)
app.use('/user', usersRouter)

// 404中间件
app.use(notFoundMiddleware)
// 错误处理中间件
app.use(errorHandler)

export default app
