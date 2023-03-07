import jwt, {
  TokenExpiredError,
  NotBeforeError,
  JsonWebTokenError,
} from 'jsonwebtoken'
import { PRIVITE_KEY, EXPIRESD, ISSUER } from '../configs/sign'
import MyError from '../helpers/exceptionError'
import { NO_AUTH_ERROR_CODE } from '../helpers/errorCode'

interface userInfoType {
  userName: string
  password: string
}

/**
 * 生成token字符串
 * @author Peng
 * @date 2023-03-07
 * @param {any} loginInfo:userInfoType
 * @returns {string}
 */
export function generateToken(loginInfo: userInfoType): string {
  return jwt.sign(loginInfo, PRIVITE_KEY, {
    //参数 options
    algorithm: 'HS256', // 加密算法   对称加密算法
    issuer: ISSUER, // 签发人
    expiresIn: EXPIRESD, // 过期时间   单位：s
  })
}

// 解析token
export function verifyToken<T extends string>(token: T): Promise<any> {
  return new Promise((resolve, reject) => {
    // token字段 密钥 回调函数 err 通过时为空 不通过则为一个错误对象 res相反
    jwt.verify(token, PRIVITE_KEY, (error, result) => {
      if (error) {
        if (error instanceof TokenExpiredError) {
          reject(
            new MyError(
              NO_AUTH_ERROR_CODE,
              '无权限访问',
              'Token已过期',
              'noAuth'
            )
          )
        } else if (error instanceof NotBeforeError) {
          reject(
            new MyError(
              NO_AUTH_ERROR_CODE,
              '无权限访问',
              'Token未生效',
              'noAuth'
            )
          )
        } else if (error instanceof JsonWebTokenError) {
          reject(
            new MyError(
              NO_AUTH_ERROR_CODE,
              '无权限访问',
              '签名失败,无效的Token',
              'noAuth'
            )
          )
        }
      } else resolve(result)
    })
  })
}

// ;(function () {
//   const toekn = generateToken({ userName: 'zs', password: '1233' })

//   console.log('toekn -----', toekn)

//   // const valRes = await verifyToken(toekn)
//   setTimeout(async () => {
//     const valRes = await verifyToken(toekn)
//     console.log('验证结果 -----', valRes)
//   }, 5)
// })()
