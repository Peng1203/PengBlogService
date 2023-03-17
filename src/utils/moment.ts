import moment, { MomentInput } from 'moment'
import { Request, Response, NextFunction } from 'express'

/**
 * 将Momentjs 和封装的函数注册到 res 响应对象 locals 上 方便全局调用
 * @author Peng
 * @date 2023-02-20
 * @param {any} req
 * @param {any} res
 * @param {function} next
 * @returns {void}
 */

function regeditMomentTolocals(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // res.locals.moment()
  res.locals.moment = moment
  // 日期格式化 方法
  res.locals.dateFormat = dateFormat
  res.locals.dateTimeFormat = dateTimeFormat
  next()
}

// 类型别名
type dateType = number | Date | undefined


/**
 * 格式化时间的方法 YYYY-MM-DD
 * @author Peng
 * @date 2023-03-01
 * @param {any} date:dateType
 * @returns {string}
 */
export function dateFormat(date?: dateType): string {
  return moment(date || new Date()).format('YYYY-MM-DD')
}

/**
 * 格式化时间的方法 YYYY-MM-DD HH:mm:ss'
 * @author Peng
 * @date 2023-03-01
 * @param {any} date:dateType
 * @returns {string}
 */
export function dateTimeFormat(date?: dateType): string {
  return moment(date || new Date()).format('YYYY-MM-DD HH:mm:ss')
}

export default regeditMomentTolocals