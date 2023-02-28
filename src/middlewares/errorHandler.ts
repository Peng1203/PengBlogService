import { Request, Response, NextFunction } from 'express'
import MyError from '../helpers/exceptionError'
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
  console.log('触发错误中间件 -----', err)
  // set locals, only providing error in development
  // const { code } = err
  // console.log('code -----', code)
  // instanceof
  let { code, type, message, errors } = err
  // if (err instanceof MyError) console.log('true -----', true)
  // console.log('err -----', err.code)
  // console.log('err.name -----', err.name)
  // console.log('err.stack -----', err.stack)
  // console.log('err.message -----', err.message)
  switch (type) {
    case 'Service':
      res.status(code).send(`error: ${err.message}`)
      break
    case 'DTO': {
      // 错误信息
      let errorInfo: string[] = []
      if (Array.isArray(errors)) {
        errors.forEach((errInfo) => {
          // 断言
          const errMsgs = (errInfo as any).constraints
          for (const key in errMsgs) {
            errorInfo.push(errMsgs[key])
          }
        })
      } else if (typeof errors === 'string') {
        errorInfo.push(errors)
      }
      res.status(code).send({ code, message, errorInfo })
    }
    default:
      res.status(500).send('service error!')
      break
  }
}

export default errorHandler
