import { validate, validateOrReject, ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'
import MyError from './exceptionError'
import { PARAMS_ERROR_CODE } from './errorCode'

/**
 * validate校验DTO层方法 不抛出错误 返回错误数组
 * @author Peng
 * @date 2023-03-04
 * @param {any} DTO: DTO层校验类
 * @param {any} params: 前端参数
 * @returns {ValidationError[]} 错误数组
 */
export async function validateDTO<T>(
  DTO: any,
  params: any
): Promise<ValidationError[]> {
  try {
    // 限制前端传递多余参数
    // whitelist 选项表示只接受被 class-validator 修饰的属性，而不接受未被修饰的属性； forbidNonWhitelisted 选项表示禁止接受未被修饰的属性，如果接收到未被修饰的属性，会抛出异常
    const options = {
      whitelist: true,
      forbidNonWhitelisted: true,
    }
    return await validate(plainToClass(DTO, params), options)
  } catch (e) {
    throw e
  }
}

/**
 * validateOrReject 校验不通过则直接抛出错误
 * 无需返回参数 触发错误直接抛出 等待 错误中间件捕获
 * @author Peng
 * @date 2023-03-04
 * @param {any} DTO:any
 * @param {any} params:any
 * @returns {void}
 */
export async function validateOrRejectDTO<T>(
  DTO: any,
  params: any
): Promise<void> {
  try {
    const options = {
      whitelist: true,
      forbidNonWhitelisted: true,
    }
    return await validateOrReject(plainToClass(DTO, params), options)
  } catch (e) {
    // 当抛出错误时 使用自定义错误类
    throw new MyError(PARAMS_ERROR_CODE, '', e, 'DTO')
  }
}
