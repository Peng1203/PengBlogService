import { Op } from 'sequelize'
import UserModel from '../models/userModel'
import RoleModel from '../models/roleModel'
import {
  addToSortSet,
  delCache,
  getCache,
  incrCounter,
  isExists,
  setCache,
} from '../db/redis'
import generateCaptchaString from '../utils/generateCaptcha'
import {
  CAPTCHA_VALID_TIME,
  EXPIRESD,
  LOGIN_DISABLE_TIME,
} from '../configs/sign'
import { dateTimeFormat } from '..//utils/moment'

import { ListResponse } from '../interfaces/Common'
import { UserListItemInfo } from '../interfaces/User'

type loginInfoType = {
  userName: string
  password: string
}

type setTokenType = {
  userId: number | string
  userName: string
  token: string
}

// type tableListQueryType = {
//   page: number
//   pageSize: number
//   queryStr: string
//   column?: string
//   order?: 'ASC' | 'DESC'
// }
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
      const setRes = await setCache(
        `loginCaptcha:${uuid}`,
        generateCaptcha,
        CAPTCHA_VALID_TIME
      )
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
      const setRes = await setCache(
        `loginCaptchaPassed:${uuid}`,
        code,
        CAPTCHA_VALID_TIME
      )
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
   * 查询数据库中是否存在指定用户
   * @author Peng
   * @date 2023-03-22
   * @param {any} userName:string
   * @returns {any}
   */
  public async findUserByUsername(userName: string): Promise<boolean> {
    try {
      const findRes = await UserModel.findOne({ where: { userName } })
      return !!findRes
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
      await addToSortSet(`tokenBlackList`, token, Date.now())
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
  public async userInfoIsMatch(
    userId: string | number,
    userName: string
  ): Promise<boolean> {
    try {
      const findRes = await UserModel.findOne({
        where: {
          id: userId,
          // id: 0,
          userName,
        },
      })
      return !!findRes?.toJSON()
    } catch (e) {
      throw e
    }
  }

  /**
   * 获取登录错误计数器
   * @author Peng
   * @date 2023-03-22
   * @param {any} uuid:string
   * @returns {any}
   */
  public async getLoginErrorCount(uuid: string): Promise<number> {
    try {
      return await getCache(`errorCounter:${uuid}`)
    } catch (e) {
      throw e
    }
  }

  /**
   * 增加登录错误计数器
   * @author Peng
   * @date 2023-03-22
   * @param {any} uuid:string
   * @returns {any}
   */
  public async incrLoginErrorCount(uuid: string): Promise<void> {
    try {
      await incrCounter(`errorCounter:${uuid}`, LOGIN_DISABLE_TIME)
    } catch (e) {
      throw e
    }
  }

  /**
   * 重置登录错误计数器
   * @author Peng
   * @date 2023-03-26
   * @param {any} uuid:string
   * @returns {any}
   */
  public async resetLoginErrorCount(uuid: string): Promise<boolean> {
    try {
      return await delCache(`errorCounter:${uuid}`)
    } catch (e) {
      throw e
    }
  }

  /**
   * 设置数据库中 用户解封时间
   * @author Peng
   * @date 2023-03-26
   * @param {any} second:string
   * @returns {string} 返回禁用时长
   */
  public async setUserUnsealTime(
    userName: string,
    second: number
  ): Promise<string> {
    try {
      const unsealTime = dateTimeFormat(Date.now() + second * 1000)
      const res = await UserModel.update(
        { unsealTime },
        { where: { userName } }
      )
      return res[0] === 1 ? unsealTime : ''
    } catch (e) {
      throw e
    }
  }

  /**
   * 查询用户列表
   * @author Peng
   * @date 2023-03-31
   * @param {any} params:object
   * @returns {any}
   */
  public async getUserList(params: object): Promise<ListResponse> {
    try {
      const { page, pageSize, queryStr, column, order } = params as any
      const { rows, count: total } = await UserModel.findAndCountAll({
        where: {
          [Op.or]: [
            { id: { [Op.like]: `%${queryStr}%` } },
            { userName: { [Op.like]: `%${queryStr}%` } },
          ],
        },
        offset: (page - 1) * pageSize,
        limit: pageSize,
        attributes: { exclude: ['password', 'avatar'] },
        order: [[column || 'id', order || 'ASC']],
      })
      const data: UserListItemInfo[] = rows.map(row => {
        return row.toJSON()
        // const dataRes = row.toJSON()
        // const avatar = dataRes.avatar ? dataRes.avatar.toString('base64') : null
        // return {
        //   ...dataRes,
        //   avatar,
        // }
      })
      return { data, total }
    } catch (e) {
      throw e
    }
  }
}

export default UserService
