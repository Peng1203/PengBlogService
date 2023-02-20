const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 记录 HTTP 日志

// 定义路由
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404中间件
app.use(require('./middlewares/404Middleware'));
// 错误处理中间件
app.use(require('./middlewares/errorHandler'));

module.exports = app;
