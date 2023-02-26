import { Request, Response, NextFunction } from 'express'

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
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log('触发错误中间件 -----')
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(500).send(`error: ${err.message}`)
}

export default errorHandler
