import UserModel from '../models/userModel'
import RoleModel from '../models/roleModel'
import { addToSet, delCache, getCache, isExists, setCache } from '../db/redis'
import generateCaptchaString from '../utils/generateCaptcha'
import { EXPIRESD } from '../configs/sign'

type loginInfoType = {
  userName: string
  password: string
}

type setTokenType = {
  userId: number | string
  userName: string
  token: string
}
/**
 * 定义service 用户类
 */

class UserService {
  /**
   * 生成验证码存储到缓存中
   * @author Peng
   * @date 2023-03-11
   * @param {any} uuid:string
   * @returns {any}
   */
  public async createCaptcha(uuid: string): Promise<string> {
    try {
      const generateCaptcha = generateCaptchaString()
      const setRes = await setCache(`loginCaptcha:${uuid}`, generateCaptcha, 60)
      if (setRes !== 'OK') throw new Error('服务器内部错误')
      return generateCaptcha
    } catch (e) {
      throw e
    }
  }

  /**
   * 描述
   * @author Peng
   * @date 2023-03-11
   * @param {any} uuid:string
   * @returns {any}
   */
  public async getCaptcha(uuid: string): Promise<string | null> {
    try {
      return await getCache(`loginCaptcha:${uuid}`)
    } catch (e) {
      throw e
    }
  }

  /**
   * 将通过验证码校验的UUID存储在redis中 用于后续登录接口校验
   * @author Peng
   * @date 2023-03-14
   * @param {any} uuid:string
   * @returns {any}
   */
  public async setValidatedCaptchaUUID(
    uuid: string,
    code: string
  ): Promise<string> {
    try {
      const setRes = await setCache(`loginCaptchaPassed:${uuid}`, code, 60)
      if (setRes !== 'OK') throw new Error('服务器内部错误')
      return setRes
    } catch (e) {
      throw e
    }
  }

  /**
   * 校验登录账号是否通过验证码校验
   * @author Peng
   * @date 2023-03-18
   * @param {any} uuid:string
   * @param {any} code:string
   * @returns {any}
   */
  public async checkUserLoginCaptcha(
    uuid: string,
    code: string
  ): Promise<boolean> {
    try {
      const catchVal = (await getCache(`loginCaptchaPassed:${uuid}`)) as any
      if (!catchVal) return false
      if (code !== catchVal) return false
      return true
    } catch (e) {
      throw e
    }
  }

  /**
   * 根据用户名和密码查询数据库
   * @author Peng
   * @date 2023-03-13
   * @param {any} {userName
   * @param {any} password
   * @param {any} }:loginInfoType
   * @returns {any}
   */
  public async userLogin({
    userName,
    password,
  }: loginInfoType): Promise<object | null> {
    try {
      const findUserRes = await UserModel.findOne({
        where: {
          user_name: userName,
          password,
        },
        include: [RoleModel],
        attributes: [
          'id',
          'email',
          'state',
          'createdTime',
          'updateTime',
          'avatar',
          'unsealTime',
        ],
      })
      if (!findUserRes) return null
      const {
        id,
        email,
        state,
        createdTime,
        updateTime,
        avatar,
        unsealTime,
        Role,
      } = findUserRes.toJSON()

      const {
        id: roleId,
        roleName,
        roleDesc,
        menus,
        operationPermissions: authBtnList,
      } = Role
      return {
        id,
        roleId,
        userName,
        roleName,
        roleDesc,
        email,
        state,
        avatar,
        menus,
        authBtnList,
        createdTime,
        updateTime,
        unsealTime,
      }
    } catch (e) {
      throw e
    }
  }

  /**
   * 将token 存在redis 中
   * @author Peng
   * @date 2023-03-14
   * @param {any} info:setTokenType
   * @returns {void}
   */
  public async setTokenToCatch(info: setTokenType): Promise<void> {
    try {
      const { userId, userName, token } = info
      const userTokenKey = `user_token:${userId}_${userName}`
      const setRes = await setCache(userTokenKey, token, EXPIRESD)
      if (setRes !== 'OK') throw new Error('服务器内部错误!')
    } catch (e) {
      throw e
    }
  }

  /**
   * 判断当前用户是否已经生成了有效token
   * @author Peng
   * @date 2023-03-14
   * @param {any} userId:string|number
   * @param {any} userName:string
   * @returns {any}
   */
  public async currentUserHasToken(
    userId: string | number,
    userName: string
  ): Promise<any> {
    try {
      return isExists(`user_token:${userId}_${userName}`)
    } catch (e) {
      throw e
    }
  }

  /**
   * 将旧token 删除并 出入黑名单中
   * @author Peng
   * @date 2023-03-14
   * @param {any} userId:string|number
   * @param {any} userName:string
   * @returns {any}
   */
  public async setOldTokenToTokenBlackList(
    userId: string | number,
    userName: string
  ): Promise<void> {
    try {
      const key = `user_token:${userId}_${userName}`
      const token = (await getCache(key)) as string
      await addToSet(`tokenBlackList`, token)
      await delCache(key)
    } catch (e) {
      throw e
    }
  }

  /**
   * 查询数据库 用户id和用户名是否匹配
   * @author Peng
   * @date 2023-03-19
   * @param {any} userId:string|number
   * @param {any} userName:string
   * @returns {any}
   */
  public async userInfoIsMatch(userId: string | number, userName: string): Promise<boolean> {
    try {
      const findRes = await UserModel.findOne({
        where: {
          id: userId,
          // id: 0,
          userName
        }
      })
      return !!(findRes?.toJSON())
    } catch (e) {
      throw e
    }
  }
}

export default UserService
