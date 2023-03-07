import { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { GetTestListDTO, PostTestDTO, updateTestDTO } from '../dtos/testDTO'
import TestService from '../services/testService'
import MyError from './../helpers/exceptionError'
import { PARAMS_ERROR_CODE } from './../helpers/errorCode'
import { validateDTO, validateOrRejectDTO } from '../helpers/validateParams'

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
      const errors = await validateDTO(GetTestListDTO, req.query)
      if (errors.length) throw new MyError(PARAMS_ERROR_CODE, '', errors, 'DTO')
      // 抛出错误校验
      // await validateOrRejectDTO(GetTestListDTO, req.query)
      const {
        count,
        total,
        rows: data,
      } = await this.testService.getTestList(req.query)
      res.send({
        code: 200,
        message: 'Success',
        data,
        count,
        total,
        method: 'getTestList',
      })
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
      res.send({
        code: 200,
        message: '成功',
        data: result,
        method: 'getTestInfoByID',
      })
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
      if (errors.length) throw new MyError(PARAMS_ERROR_CODE, '', errors, 'DTO')

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

  /**
   * 通过ID修改 测试信息
   * @author Peng
   * @date 2023-03-06
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public updateTestInfoByID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { params, body } = req
      const editID: number | boolean = parseInt(params.id) || false
      if (!editID)
        throw new MyError(
          PARAMS_ERROR_CODE,
          'params error!',
          'id参数有误!',
          'DTO',
          'updateTestInfoByID'
        )
      await validateOrRejectDTO(updateTestDTO, body)

      const result = await this.testService.updateTestInfo(params.id, body)
      res.send({
        code: '200',
        message: result[0] ? 'Success' : 'Failed',
        info: result[0] ? '修改成功!' : '修改失败!',
        method: 'deleteTestInfoByID',
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 通过ID删除测试数据
   * @author Peng
   * @date 2023-03-07
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public deleteTestInfoByID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.query.id as string
      const deleteID: number | boolean = parseInt(id) || false
      if (!deleteID)
        throw new MyError(
          PARAMS_ERROR_CODE,
          '',
          'id参数有误!',
          'DTO',
          'deleteTestInfoByID'
        )

      const result = await this.testService.deleteTestInfo(id)
      res.send({
        code: '200',
        message: result ? 'Success' : 'Failed',
        info: result ? '删除成功!' : '删除失败!',
        method: 'deleteTestInfoByID',
      })
    } catch (e) {
      next(e)
    }
  }
}

export default TestController
