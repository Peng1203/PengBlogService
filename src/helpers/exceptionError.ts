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
  errors: object[]
  constructor(
    errCode: number,
    message: string,
    errors: object[],
    type: string | undefined,
  ) {
    super(message)
    this.type = type
    this.code = errCode
    this.errors = errors
    this.message = message
    this.name = 'MyError'
  }
}