import path from 'path'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import requestIp from 'request-ip'
import userAgent from 'express-useragent'
import bodyParser from 'body-parser'
import _logger from './utils/logger'
import _moment from './utils/moment'
import _env from './utils/environment'
import indexRouter from './routes/indexRouter'
import testRouter from './routes/testRouter'
import usersRouter from './routes/usersRouter'
import roleRouter from './routes/roleRouter'
import menuRouter from './routes/menuRouter'
import authPermissionRouter from './routes/authPermissionRouter'
import tagRouter from './routes/tagRouter'
import categoryRouter from './routes/categoryRouter'
import articleRouter from './routes/articleRouter'
import systemRouter from './routes/systemRouter'
import notFoundMiddleware from './middlewares/404Middleware'
import errorHandler from './middlewares/errorHandler'
import handleParamsType from './middlewares/handleParamsType'
import authMiddleware from './middlewares/authMiddleware'
import setHeader, { setResourceHeader } from './middlewares/defaultHeader'
import taskManager from './tasks'

const app = express()

// 设置请求体大小限制为50MB
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(cors())
app.use(setHeader)
app.use(express.json())
app.use(cookieParser())
app.use(
  session({
    secret: 'Peng1203', // 设置会话密钥
    resave: false,
    saveUninitialized: true,
  })
)

app.use(express.urlencoded({ extended: false }))
// 设置静态资源服务器
app.use(
  '/resource',
  express.static(path.join(__dirname, './public'), {
    setHeaders: setResourceHeader,
  })
)

// 解析客户端信息
app.use(requestIp.mw())
app.use(userAgent.express())
// 记录 HTTP请求 日志
app.use(_logger)
// 将全局通用的库 或者函数 注册到 res 响应对象上
app.use(_moment)
// 将环境变量 设置到 res 响应对象上
app.use(_env)
// 处理解析过后的参数类型 中间件
app.use(handleParamsType)
// 校验路由是否需要token中间件
app.use(authMiddleware)

// 定义路由
app.use('/index', indexRouter)
app.use('/test', testRouter)
app.use('/user', usersRouter)
app.use('/role', roleRouter)
app.use('/menu', menuRouter)
app.use('/auth-permission', authPermissionRouter)
app.use('/article', articleRouter)
app.use('/article-tag', tagRouter)
app.use('/article-category', categoryRouter)
app.use('/system', systemRouter)

// 404中间件
app.use(notFoundMiddleware)
// 错误处理中间件
app.use(errorHandler)

// 开启全部定时任务
taskManager.startTasks()

export default app
