import { Request, Response, NextFunction } from 'express'
import { dateTimeFormat } from '../utils/moment'

/**
 * 路由 404 中间件
 * @author Peng
 * @date 2023-02-20
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {void}
 */

function notFound(req: Request, res: Response, next: NextFunction): void {
  res.status(404).json({
    code: 404,
    status: 'error',
    message: 'Not found',
    path: req.path,
    timestamp: dateTimeFormat(),
  })
}

export default notFound
