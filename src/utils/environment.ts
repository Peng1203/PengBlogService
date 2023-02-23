import { Request, Response, NextFunction } from 'express'
/** 
 * 开发环境
 * development
 * production
 */
function env(res: Request, req: Response, next: NextFunction): void {
  req.locals.env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
}

module.exports = env