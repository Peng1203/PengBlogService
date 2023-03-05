import express, { Request, Response, NextFunction } from 'express'
const router = express.Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction): void {
  console.log('有客户端访问')
  res.send(`你好 当前开发环境${res.locals.env}`);

});

export default router
