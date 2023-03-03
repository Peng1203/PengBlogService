import { Request, Response, NextFunction } from 'express'
import { validate, validateOrReject } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { GetTestListDTO, PostTestDTO } from '../dtos/testDTO'
import TestService from '../services/testService'
import MyError from './../helpers/exceptionError'
import { PARAMS_ERROR_CODE } from './../helpers/errorCode'

class TestController {
  // 创建测试service 实例
  private testService = new TestService()

  /**
   * 查询测试 支持分页
   * @author Peng
   * @date 2023-02-27
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {Promise}
   */
  public getTestList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const errors = await validate(plainToClass(GetTestListDTO, req.query))
      if (errors.length)
        throw new MyError(PARAMS_ERROR_CODE, 'params error!', errors, 'DTO')
      console.log('你好 -----', req.query)
      res.send('获取测试数据列表')
    } catch (e) {
      next(e)
    }
  }

  /**
   * 通过 ID 查询测试数据
   * @author Peng
   * @date 2023-02-27
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {Promise<void>}
   */
  public getTestInfoByID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const queryID: number | boolean = parseInt(req.params.id) || false
      if (!queryID)
        throw new MyError(
          PARAMS_ERROR_CODE,
          'params error!',
          'id参数有误!',
          'DTO'
        )
      const result = await this.testService.getTestInfoByID(req.params.id)
      console.log('result -----', typeof result, result)
      res.send(result)
    } catch (e) {
      next(e)
    }
  }

  /**
   * 测试Post提交
   * @author Peng
   * @date 2023-02-26
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {Promise<void>}
   * 在类中使用
   */
  public postTest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.body.age = Number(req.body.age)
      // 校验DTO层
      const errors = await validate(plainToClass(PostTestDTO, req.body))
      if (errors.length)
        throw new MyError(PARAMS_ERROR_CODE, '', errors, 'DTO')

      // 调用Service层 操作模型
      const result = await this.testService.createdTestData(req.body)
      console.log('result -----', result)
      if (!Object.keys(result.dataValues)) {
        res.send({
          code: '200',
          message: 'Falied',
        })
      } else {
        res.send({ code: '200', message: 'Success', data: result.dataValues })
      }
    } catch (e) {
      next(e)
    }
  }
}

export default TestController
