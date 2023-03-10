import { Request, Response, NextFunction } from 'express'
import UserService from '../services/userService'

class UserController {
  private userService = new UserService()

  /**
   * 用户登录
   * @author Peng
   * @date 2023-03-10
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public userLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { body, sessionID, cookies } = req as any
      console.log('body -----', body)
      console.log('sessionID -----', sessionID)
      console.log('cookies -----', cookies)

      res.send('登录')
    } catch (e) {
      next(e)
    }
  }
}

export default UserController
