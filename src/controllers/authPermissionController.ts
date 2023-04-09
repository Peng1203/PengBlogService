import { Request, Response, NextFunction } from 'express'
import AuthPermissionService from '../services/authPermissionService'
import { validateOrRejectDTO } from '../helpers/validateParams'
import {
  AddAuthPermissionDTO,
  GetAuthPermissionListDTO,
} from '../dtos/authPermissionDTO'

class AuthPermissionController {
  private authPermissionService = new AuthPermissionService()

  /**
   * 获取权限标识列表
   * @author Peng
   * @date 2023-04-09
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public getAuthPermissionList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(GetAuthPermissionListDTO, req.query)
      const { data, total } =
        await this.authPermissionService.findAuthPermissionList(
          req.query as any
        )
      res.send({
        code: 200,
        message: 'Success',
        data,
        total,
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 添加权限标识
   * @author Peng
   * @date 2023-04-09
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public addAuthPermission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(AddAuthPermissionDTO, req.body)

      const addRes = await this.authPermissionService.createdAuthPermission(
        req.body
      )

      res.send({
        code: 200,
        message: addRes ? 'Success' : 'Failed',
        data: addRes
          ? '新增权限标识成功!'
          : '新增权限标识失败, 该权限标识已存在!',
      })
    } catch (e) {
      next(e)
    }
  }
}

export default AuthPermissionController
