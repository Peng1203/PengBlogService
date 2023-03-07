/**
 * 扩展错误对象
 * @date 2023/2/27 - 17:43:06
 * @author Peng
 * @export MyError
 * @class MyError
 * @typedef {MyError}
 * @extends {Error}
 */
export default class MyError extends Error {
  code: number
  type: string
  errors: object[] | string
  method?: string
  constructor(
    errCode: number,
    message: string | '',
    errors: object[] | string,
    type: string | undefined,
    method?: string
  ) {
    super(message)
    this.type = type
    this.code = errCode
    this.errors = errors
    this.method = method || ''
    this.message = message || '参数有误!'
    this.name = 'MyError'
  }
}
