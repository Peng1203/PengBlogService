import { Request, Response, NextFunction } from 'express'
import { validate, validateOrReject } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { PostTestDTO } from '../dtos/testDTO'
import TestService from '../services/testService'

class TestController {
  // 创建测试service 实例
  public testService = new TestService()

  /**
   * 测试Post提交
   * @author Peng
   * @date 2023-02-26
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   * 在类中使用
   */
  public postTest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.body.age = Number(req.body.age)
    // console.log(' -----', req.body)
    // 校验DTO层
    const errors = await validate(plainToClass(PostTestDTO, req.body))
    if (errors.length > 0) {
      const errorMessage = errors
        .map((error) => Object.values(error.constraints))
        .join(', ')
      res.status(400).json({ code: 400, message: errorMessage })
      return
    }

    // 调用Service层 操作模型
    const result = await this.testService.createdTestData({ ...req.body, })
    console.log('调用Service层 result -----', result)

    res.send('成功!!!')
  }
}

export default TestController
