import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/token'
import { checkSetHasValue } from '../db/redis'

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
  '/user/login',
  '/user/logout',
  '/user/logout',
  '/user/logout',
  '/user/logout',
  '/user/logout',
  '/test/getToken',
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
    const isNoAuthRequest = UN_AUTH_PATH.some((unAuthPath) =>
      path.includes(unAuthPath)
    )
    // 判断为不需要权限的接口直接放行
    if (isNoAuthRequest) return next()

    // 签名验证token 是否 合法
    const valRes = await verifyToken(token)
    console.log('valRes -----', valRes)

    // 查询 Redis 中的token 黑名单 是否存在当前token
    const isHave = await checkSetHasValue('tokenBlackList', token)
    console.log('当前token是否存在token 黑名单中? -----', isHave)

    next()
  } catch (e) {
    next(e)
  }
}

export default authMiddleware
