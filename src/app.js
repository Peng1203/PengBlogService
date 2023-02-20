const createError = require('http-errors');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 记录 HTTP请求 日志
app.use(require('./utils/logger'))
// 将全局通用的库 或者函数 注册到 res 响应对象上
app.use(require('./utils/moment'))

// 定义路由
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404中间件
app.use(require('./middlewares/404Middleware'));
// 错误处理中间件
app.use(require('./middlewares/errorHandler'));

module.exports = app;
