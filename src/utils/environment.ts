import { Request, Response, NextFunction } from 'express'
/** 
 * 开发环境
 * development
 * production
 */
function env(req: Request, res: Response, next: NextFunction): void {
  res.locals.env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
  next()
}

export default env