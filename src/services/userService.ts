import UserModel from '../models/userModel'
import { getCache, isExists, setCache } from '../db/redis'
import generateCaptchaString from '../utils/generateCaptcha'

/**
 * 定义service 用户类
 */

class UserService {
  // 生成验证码存储到缓存中
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

  // 获取缓存中的验证码
  public async getCaptcha(uuid: string): Promise<string | null> {
    try {
      return await getCache(`loginCaptcha:${uuid}`)
    } catch (e) {
      throw e
    }
  }

  // 将通过验证码校验的UUID存储在redis中 用于后续登录接口校验
  public async setValidatedCaptchaUUID(uuid: string): Promise<string> {
    try {
      const setRes = await setCache(`loginCaptchaPassed:${uuid}`, '1', 60)
      if (setRes !== 'OK') throw new Error('服务器内部错误')
      return setRes
    } catch (e) {
      throw e
    }
  }

  // 校验登录账号是否通过验证码校验
  public async checkUserLoginCaptcha(uuid: string): Promise<boolean> {
    try {
      return await isExists(`loginCaptchaPassed:${uuid}`)
    } catch (e) {
      throw e
    }
  }
}

export default UserService
