/**
 * 生成验证码
 * @author Peng
 * @date 2023-03-11
 * @returns {string}
 */
function generateCaptchaString(): string {
  let pool: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result: string = ''
  for (let i = 0; i < 4; i++) {
    result += pool.charAt(Math.floor(Math.random() * pool.length))
  }
  return result
}

export default generateCaptchaString