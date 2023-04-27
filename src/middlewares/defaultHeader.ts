import { Request, Response, NextFunction } from 'express'

/**
 * 设置默认响应头
 * @author Peng
 * @date 2023-03-10
 * @param {any} req:Request
 * @param {any} res:Response
 * @param {any} next:NextFunction
 * @returns {any}
 */
function setHeader(req: Request, res: Response, next: NextFunction): void {
  // 当访问资源服务器时 不进行响应头设置
  if (req.path.indexOf('resource') > -1) return next()

  res.setHeader('Content-Type', 'application/json')
  // res.setHeader('Access-Control-Allow-Origin', '*')
  next()
}

/**
 * 设置静态资源响应头
 * @author Peng
 * @date 2023-04-28
 * @param {any} res:Response
 * @param {any} path
 * @param {any} stat
 * @returns {any}
 */
export function setResourceHeader(res: Response, path, stat) {}

export default setHeader
