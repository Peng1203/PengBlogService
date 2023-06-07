import { Request, Response, NextFunction } from 'express'
// declare module 'express' {
//   // 处理 Express 请求的函数
//   export type ExpressHandler = (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => Promise<any>
// }

// 处理 Express 请求的函数
export type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>
