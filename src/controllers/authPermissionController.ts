import { Request, Response, NextFunction } from 'express'
import AuthPermissionService from '../services/authPermissionService'
import { validateOrRejectDTO } from '../helpers/validateParams'
import {
  AddAuthPermissionDTO,
  GetAuthPermissionListDTO,
  UpdateAuthPermissionDTO,
} from '../dtos/authPermissionDTO'
import { PARAMS_ERROR_CODE } from '../helpers/errorCode'
import MyError from '../helpers/exceptionError'

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

  /**
   * 通过ID删除操作权限标识
   * @author Peng
   * @date 2023-04-09
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public delAuthPermission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const id: number | boolean = parseInt(req.params.id) || false
      if (!id || id <= 0)
        throw new MyError(
          PARAMS_ERROR_CODE,
          'params error!',
          '权限标识id参数有误!',
          'DTO'
        )
      const findRes = await this.authPermissionService.findAuthPermissionById(
        id
      )

      if (!findRes)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '未找到相关权限标识信息!',
        })

      const delRes = await this.authPermissionService.deleteAuthPermissionById(
        id
      )
      res.send({
        code: 200,
        message: delRes ? 'Success' : 'Failed',
        data: delRes ? '删除权限标识成功!' : '删除权限标识失败!',
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 通过ID更新权限标识
   * @author Peng
   * @date 2023-04-09
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public updateAuthPermissionInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const id: number | boolean = parseInt(req.params.id) || false
      if (!id || id <= 0)
        throw new MyError(
          PARAMS_ERROR_CODE,
          'params error!',
          '权限标识id参数有误!',
          'DTO'
        )

      await validateOrRejectDTO(UpdateAuthPermissionDTO, req.body)

      const findRes = await this.authPermissionService.findAuthPermissionById(
        id
      )

      if (!findRes)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '未找到相关权限标识信息!',
        })

      const updateRes =
        await this.authPermissionService.updateAuthPermissionById(id, req.body)
      res.send({
        code: 200,
        message: updateRes ? 'Success' : 'Failed',
        data: updateRes ? '更新权限标识成功!' : '更新权限标识失败!',
      })
    } catch (e) {
      next(e)
    }
  }
}

export default AuthPermissionController
