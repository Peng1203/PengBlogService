import express from 'express'
import cookieParser from 'cookie-parser'
import _logger from './utils/logger'
import _moment from './utils/moment'
import indexRouter from './routes/index'
import usersRouter from './routes/users'
import env from './utils/environment'
import notFoundMiddleware from './middlewares/404Middleware'
import errorHandler from './middlewares/errorHandler'

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(require('path').join(__dirname, process.env.NODE_ENV === 'development' ? '../public' : 'public')));
// 记录 HTTP请求 日志
// app.use(_logger)
// 将全局通用的库 或者函数 注册到 res 响应对象上
app.use(_moment)
// 将环境变量 设置到 res 响应对象上
app.use(env)

// 定义路由
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404中间件
app.use(notFoundMiddleware);
// 错误处理中间件
app.use(errorHandler);

module.exports = app;
