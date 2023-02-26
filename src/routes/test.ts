import express, { Request, Response, NextFunction } from 'express'
import { TestDTO } from '../dtos/testDTO'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer';
const router = express.Router();

router.post('/post', async function (req: Request, res: Response, next: NextFunction): Promise<void> {

  req.body.age = Number(req.body.age)
  console.log(' -----', req.body)
  // console.log('process.env -----', process.env.NODE_ENV)
  // const testDTO = new TestDTO()

  const validRes = await validate(plainToClass(TestDTO, req.body))
  // console.log('validRes -----', validRes)
  // validRes.forEach(errValid => {
  //   console.log('errValid -----', errValid)
  // })
  res.send(`测试`);

});

export default router
