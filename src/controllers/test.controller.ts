import { Request, Response, NextFunction } from 'express'
import { TestDTO } from '../dtos/testDTO'
import { validate, validateOrReject } from 'class-validator'
import { plainToClass } from 'class-transformer'

class TestController {
  /**
   * 测试Post提交
   * @author Peng
   * @date 2023-02-26
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public async postTest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    req.body.age = Number(req.body.age)
    console.log(' -----', req.body)
    // console.log('process.env -----', process.env.NODE_ENV)
    // const testDTO = new TestDTO()
    const errors = await validate(plainToClass(TestDTO, req.body))

    if (errors.length > 0) {
      const errorMessage = errors
        .map((error) => Object.values(error.constraints))
        .join(', ')
      res.status(400).json({ code: 400, message: errorMessage })
      return
    }

    res.send('成功!!!')
  }
}

export default TestController
