import { Request, Response, NextFunction } from 'express'
import { PARAMS_ERROR_CODE } from '../helpers/errorCode'
import { UUID_REGEX } from '../helpers/regex'
import MyError from '../helpers/exceptionError'
import UserService from '../services/userService'
import generateUUID from '../utils/uuid'
class UserController {
  private userService = new UserService()

  /**
   * 获取验证码
   * @author Peng
   * @date 2023-03-11
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public getCaptcha = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const uuid = req.headers.uuid || req.body.uuid || req.query.uuid
      let generateCaptcha = ''
      const resResult = {} as any
      // 表示第一次请求没有uuid
      if (!uuid) {
        const UUID = generateUUID()
        resResult.uuid = UUID
        generateCaptcha = await this.userService.createCaptcha(UUID)
      } else if (UUID_REGEX.test(uuid)) {
        // 当uuid存在时 校验格式 
        generateCaptcha = await this.userService.createCaptcha(uuid)
      } else {
        throw new MyError(PARAMS_ERROR_CODE, '', 'UUID参数格式有误!', 'DTO')
      }

      res.send({
        code: 200,
        message: 'Success',
        data: generateCaptcha,
        ...resResult,
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 校验验证码
   * @author Peng
   * @date 2023-03-11
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public verifyCaptcha = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { code, uuid } = req.body
      if (!code || !uuid) throw new MyError(PARAMS_ERROR_CODE, '', '验证码和uuid不能为空!', 'DTO')
      if (!UUID_REGEX.test(uuid)) throw new MyError(PARAMS_ERROR_CODE, '', 'UUID参数格式有误!', 'DTO')

      const findRes = await this.userService.getCaptcha(uuid)
      if (findRes === null) return res.send({
        code: 200,
        message: 'Failed',
        data: '验证码失效或已过期!'
      })

      if (findRes !== code) return res.send({
        code: 200,
        message: 'Failed',
        data: '验证码错误!'
      })

      // 通过校验时 把当前通过校验的客户端标识 放入缓存中 用于后续登录接口校验 
      await this.userService.setValidatedCaptchaUUID(uuid)

      res.send({
        code: 200,
        message: 'Success',
        data: '校验通过'
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 用户登录
   * @author Peng
   * @date 2023-03-10
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public userLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // const { body, sessionID, cookies } = req as any
      // console.log('body -----', body)
      // console.log('sessionID -----', sessionID)
      // console.log('cookies -----', cookies)

      res.send('登录')
    } catch (e) {
      next(e)
    }
  }
}

export default UserController
