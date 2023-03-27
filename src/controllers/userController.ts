import { Request, Response, NextFunction } from 'express'
import moment from 'moment'
import { FORBIDDEN_ERROR_CODE, PARAMS_ERROR_CODE } from '../helpers/errorCode'
import { UserLoginDTO, UserLogoutDTO } from '../dtos/userDTO'
import { validateOrRejectDTO } from '../helpers/validateParams'
import { UUID_REGEX } from '../helpers/regex'
import { generateToken, verifyToken } from '../utils/token'
import MyError from '../helpers/exceptionError'
import UserService from '../services/userService'
import generateUUID from '../utils/uuid'
import { LOGIN_DISABLE_TIME, MAX_TRY_ERROR_COUNT } from '../configs/sign'
import { dateTimeFormat } from '../utils/moment'
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
      if (!code || !uuid)
        throw new MyError(PARAMS_ERROR_CODE, '', '验证码和uuid不能为空!', 'DTO')
      if (!UUID_REGEX.test(uuid))
        throw new MyError(PARAMS_ERROR_CODE, '', 'UUID参数格式有误!', 'DTO')

      const findRes = await this.userService.getCaptcha(uuid)
      if (findRes === null)
        return res.send({
          code: 200,
          message: 'Expire',
          data: '验证码失效或已过期!',
        })

      if (findRes !== code)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '验证码错误!',
        })

      // 通过校验时 把当前通过校验的客户端标识 放入缓存中 用于后续登录接口校验
      await this.userService.setValidatedCaptchaUUID(uuid, code)

      res.send({
        code: 200,
        message: 'Success',
        data: '校验通过',
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
  ): Promise<any> => {
    try {
      // DTO层校验
      await validateOrRejectDTO(UserLoginDTO, req.body)

      const { userName, password, captcha, uuid } = req.body
      // 验证码 校验该账号是否通过验证码
      const isPass = await this.userService.checkUserLoginCaptcha(uuid, captcha)
      if (!isPass)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '验证码有误或已过期!',
        })

      // 查询 用户是否在数据库中
      const isUserExist = await this.userService.findUserByUsername(userName)
      if (!isUserExist)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '账户不存在!',
        })

      // 判断当前登录账户是否已经达到最大试错数
      const errConter = await this.userService.getLoginErrorCount(uuid)
      // 当登录次数已经超过试错次数
      if (errConter !== null && errConter >= MAX_TRY_ERROR_COUNT) {
        // 设置数据库中的禁用时间 防止切换不同设备 限制失效 可优化
        await this.userService.setUserUnsealTime(userName, LOGIN_DISABLE_TIME)

        return res.send({
          code: 200,
          message: 'Failed',
          data: `登录错误次数已达到最大限制, 请在${
            LOGIN_DISABLE_TIME / 60
          }分钟后尝试`,
        })
      }

      // 根据 用户名和 密码 查询数据库中的信息
      const result = (await await this.userService.userLogin({
        userName,
        password,
      })) as any
      // console.log('result -----', result)
      // 当用户信息不存在 则进行登录错误计数器 进行累加
      if (!result) {
        // redis 中记录当前账号 登录错误计数器
        await this.userService.incrLoginErrorCount(uuid)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '用户名或密码错误!',
        })
      }

      const { id, state, unsealTime } = result as any | null
      // 判断当前登录账户是否锁定
      if (state !== 1) {
        return res.send({
          code: 200,
          message: 'Failed',
          data: '账号已被停用, 请联系管理员!',
        })
      }

      // 判断是否未过锁定时间
      if (unsealTime) {
        // 解禁的毫秒时间戳
        const unsealTimeStamp = moment(unsealTime).valueOf()
        if (unsealTimeStamp > Date.now())
          return res.send({
            code: 200,
            message: 'Failed',
            data: `账号已被锁定, 解锁日期 ${dateTimeFormat(unsealTimeStamp)}`,
          })
      }

      // 查询缓存中 当前账户是否已生成有效token
      const isHaveTrueToekn = await this.userService.currentUserHasToken(
        id,
        userName
      )
      // true 将之前有效token 放入token黑名单 false 则正常走登录流程
      if (isHaveTrueToekn)
        await this.userService.setOldTokenToTokenBlackList(id, userName)

      // 生成 token
      const token = generateToken({ userName, password })
      // 将token 存入 redis 中 如果存在之前的token并覆盖掉
      await this.userService.setTokenToCatch({
        userId: id,
        userName,
        token,
      })

      // 登录成功 清除登录错误计数器
      await this.userService.resetLoginErrorCount(uuid)
      res.send({
        code: 200,
        message: 'Success',
        data: result,
        token,
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 退出登录
   * @author Peng
   * @date 2023-03-19
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public userLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(UserLogoutDTO, req.body)
      // 将退出登录的用户 清除在redis中的数据 并把生成的token 放入黑名单
      const { id, userName, token } = req.body
      const tokenUserInfo = await verifyToken(token)

      // 防止恶意修改提交参数 达到越权操作
      if (tokenUserInfo.userName !== userName)
        throw new MyError(
          FORBIDDEN_ERROR_CODE,
          '越权操作!',
          '权限签名用户与操作用户不匹配!',
          'noAuth'
        )
      // 查询数据库 判断 用户id 和 用户名是否匹配
      const isMatch = await this.userService.userInfoIsMatch(id, userName)
      if (!isMatch)
        throw new MyError(
          FORBIDDEN_ERROR_CODE,
          '越权操作!',
          '操作用户信息不匹配!',
          'noAuth'
        )
      await this.userService.setOldTokenToTokenBlackList(id, userName)
      res.send({
        code: 200,
        message: 'Success',
        data: '退出登录成功!',
      })
    } catch (e) {
      next(e)
    }
  }
}

export default UserController
