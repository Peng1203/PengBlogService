import { Request, Response, NextFunction } from 'express'
import moment from 'moment'
import { FORBIDDEN_ERROR_CODE, PARAMS_ERROR_CODE } from '../helpers/errorCode'
import {
  AddUserDTO,
  ChangePwdDTO,
  GetUserListDTO,
  UpdateUserDTO,
  UserLoginDTO,
  UserLogoutDTO,
} from '../dtos/userDTO'
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
      // const isPass = await this.userService.checkUserLoginCaptcha(uuid, captcha)
      // if (!isPass)
      //   return res.send({
      //     code: 200,
      //     message: 'Failed',
      //     data: '验证码有误或已过期!',
      //   })

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

  /**
   * 获取用户列表
   * @author Peng
   * @date 2023-03-31
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public getUserList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await validateOrRejectDTO(GetUserListDTO, req.query)
      const { data, total } = await this.userService.getUserList(req.query)
      res.send({
        code: 200,
        message: 'Success',
        data,
        total,
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 通过ID查询用户信息
   * @author Peng
   * @date 2023-03-31
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public getUserInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const queryID: number | boolean = parseInt(req.params.id) || false
      if (!queryID || queryID <= 0)
        throw new MyError(
          PARAMS_ERROR_CODE,
          'params error!',
          '用户id参数有误!',
          'DTO'
        )

      const data = await this.userService.findUserById(queryID)

      res.send({
        code: 200,
        message: data ? 'Success' : 'Failed',
        data: data ? data : '未找到相关用户信息',
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 添加用户
   * @author Peng
   * @date 2023-03-31
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public addUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(AddUserDTO, req.body)
      // 判断数据库中是否有同名用户
      const isCheck = await this.userService.isCheckUserName(req.body.userName)
      // console.log('是否存在? -----', isCheck)
      if (isCheck)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '当前账户已存在, 请选择其他用户名!',
        })

      // 添加用户
      const addRes = await this.userService.createdUser(req.body)
      res.send({
        code: 200,
        message: addRes ? 'Success' : 'Failed',
        data: addRes ? '添加成功!' : '添加失败!',
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 通过 id 删除用户
   * @author Peng
   * @date 2023-04-03
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public delUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const id: number | boolean = parseInt(req.params.id) || false
      if (!id || id <= 0)
        throw new MyError(
          PARAMS_ERROR_CODE,
          'params error!',
          '用户id参数有误!',
          'DTO'
        )
      const delRes = await this.userService.deleteUserById(id)
      res.send({
        code: 200,
        message: delRes ? 'Success' : 'Failed',
        data: delRes ? '删除成功!' : '删除失败!',
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 通过 id 更新用户信息
   * @author Peng
   * @date 2023-04-03
   * @returns {any}
   */
  public updateUserInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const params = { id: req.params.id, ...req.body }
      console.log('params -----', params)
      await validateOrRejectDTO(UpdateUserDTO, params)

      const data = await this.userService.findUserById(params.id)
      if (!data)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '更新失败!未找到相关用户',
        })

      const updataRes = await this.userService.updateUserInfo(req.body)
      res.send({
        code: 200,
        message: updataRes ? 'Success' : 'Failed',
        data: updataRes ? '更新成功!' : '更新失败!',
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 用户上传头像
   * @author Peng
   * @date 2023-04-04
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public uploadUserAvater = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      console.log('req.file -----', req.file)
      const id: number | boolean = parseInt(req.params.id) || false
      if (!id || id <= 0)
        throw new MyError(
          PARAMS_ERROR_CODE,
          'params error!',
          '用户id参数有误!',
          'DTO'
        )
      const fileBuffer = req.file?.buffer
      const updateRes = await this.userService.updataUserAvaterById(
        id,
        fileBuffer
      )
      res.send({
        code: 200,
        message: updateRes ? 'Success' : 'Failed',
        data: updateRes ? '上传头像成功!' : '上传头像失败!',
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 修改密码
   * @author Peng
   * @date 2023-04-04
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      // 校验token签名中的 userName 与 ID 和传递id和name是否符合 待
      const uid: number | boolean = parseInt(req.params.id) || false
      if (!uid || uid <= 0)
        throw new MyError(
          PARAMS_ERROR_CODE,
          'params error!',
          '用户id参数有误!',
          'DTO'
        )
      const params = { id: uid, ...req.body }
      await validateOrRejectDTO(ChangePwdDTO, params)

      const data = await this.userService.findUserById(params.id)
      if (!data)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '未找到相关用户',
        })

      const { id, userName, oldPassword, newPassword, confirmNewPassword } =
        params
      // 判断输入的旧密码是否正确
      const isHave = await this.userService.findUserByIdAndUserNameAndPwd(
        id,
        userName,
        oldPassword
      )
      if (!isHave)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '修改用户信息不匹配或旧密码有误',
        })

      // 判断2次输入的新密码是否一致
      if (newPassword !== confirmNewPassword)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '两次密码输入不一致!',
        })

      // 判断新密码是否与旧密码相等
      if (oldPassword === newPassword)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '新密码和旧密码一致!',
        })

      // 执行修改密码操作
      const updateRes = await this.userService.updateUserPwdById(
        id,
        newPassword
      )
      res.send({
        code: 200,
        message: updateRes ? 'Success' : 'Failed',
        data: updateRes ? '修改密码成功!' : '修改密码失败!',
      })
    } catch (e) {
      next(e)
    }
  }
}

export default UserController
