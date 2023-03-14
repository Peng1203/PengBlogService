import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/token'
import { checkSetHasValue } from '../db/redis'
import MyError from '../helpers/exceptionError'
import { NO_AUTH_ERROR_CODE } from '../helpers/errorCode'

/**
 * 校验 Token 中间件
 * @author Peng
 * @date 2023-03-09
 * @param {any} req:Request
 * @param {any} res:Response
 * @param {any} next:NextFunction
 * @returns {any}
 */
// 不需要 token 校验的 路由
const UN_AUTH_PATH: string[] = [
  // '/getTestList',
  '/test/getToken',
  '/user/login',
  '/user/logout',
  '/getCaptcha',
  '/verifyCaptcha',
]

async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const { path, headers, query, body } = req
    const token =
      headers.authorization || headers.token || query.token || body.token
    const isNoAuthRequest = UN_AUTH_PATH.some(unAuthPath =>
      path.includes(unAuthPath)
    )
    // 判断为不需要权限的接口直接放行
    if (isNoAuthRequest) return next()

    // 签名验证token 是否 合法
    await verifyToken(token)

    // 查询 Redis 中的token 黑名单 是否存在当前token
    const isInBlackList = await checkSetHasValue('tokenBlackList', token)
    if (isInBlackList)
      throw new MyError(
        NO_AUTH_ERROR_CODE,
        '无权限访问',
        'token已失效,请重新认证!',
        'noAuth'
      )
    next()
  } catch (e) {
    next(e)
  }
}

export default authMiddleware
