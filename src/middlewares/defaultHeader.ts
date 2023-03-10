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
  res.setHeader('Content-Type', 'application/json')
  // res.setHeader('Access-Control-Allow-Origin', '*')
  next()
}

export default setHeader
