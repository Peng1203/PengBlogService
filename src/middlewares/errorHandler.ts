import { Request, Response, NextFunction } from 'express'
import MyError from '../helpers/exceptionError'
import { dateTimeFormat } from '../utils/moment'
/**
 * 错误处理中间件
 * @author Peng
 * @date 2023-02-20
 * @param {any} err
 * @param {any} req
 * @param {any} res
 * @param {function} next
 * @returns {void}
 */

function errorHandler(
  err: MyError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // instanceof
  let { code, message, errors, type, method } = err
  switch (type) {
    case 'noAuth':
      res.status(code).send({
        code,
        message,
        errors,
        timestamp: dateTimeFormat(),
      })
      break
    case 'Service':
      res.status(code).send(`error: ${err.message}`)
      break
    case 'DTO': {
      // 错误信息
      let errorInfo: string[] = []
      if (Array.isArray(errors)) {
        errors.forEach(errInfo => {
          // 断言
          const errMsgs = (errInfo as any).constraints
          for (const key in errMsgs) {
            errorInfo.push(errMsgs[key])
          }
        })
      } else if (typeof errors === 'string') {
        errorInfo.push(errors)
      }
      res.status(code).send({
        code,
        message: message,
        errorInfo,
        method,
        timestamp: dateTimeFormat(),
      })
    }
    // 由其他类型层抛出的错误
    default: {
      let msg = ''
      // 根据sequelize 报错信息 响应不同信息
      switch (err.name) {
        case 'SequelizeUniqueConstraintError':
          msg = '更新失败, 请确保更新字段的唯一性!'
          break
        case 'SequelizeValidationError':
          msg = '参数校验不通过!'
          break
        case 'SequelizeConnectionRefusedError':
          msg = '数据库连接失败!'
          break
        case 'SequelizeDatabaseError':
          msg = '查询错误!'
          break
        case 'SequelizeForeignKeyConstraintError':
          msg = '请检查删除数据是否有其他外键关联信息!'
          break
        default:
          msg = err.message
          break
      }
      res.status(500).send({ code: 500, message: msg })
      break
    }
  }
}

export default errorHandler
