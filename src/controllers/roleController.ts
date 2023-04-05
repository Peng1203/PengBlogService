import { Request, Response, NextFunction } from 'express'
import RoleService from '../services/roleService'
import { validateOrRejectDTO } from '../helpers/validateParams'
import { AddRoleDTO, GetRoleListDTO } from '../dtos/roleDTO'

class RoleController {
  private roleService = new RoleService()

  /**
   * 获取角色列表
   * @author Peng
   * @date 2023-04-04
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public getRoleList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(GetRoleListDTO, req.query)
      const { data, total } = await this.roleService.findRoleList(req.query)
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
   * 添加角色
   * @author Peng
   * @date 2023-04-05
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public addRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(AddRoleDTO, req.body)
      const createdRes = await this.roleService.createdRole(req.body)
      res.send({
        code: 200,
        message: createdRes ? 'Success' : 'Failed',
        data: createdRes ? '创建角色成功!' : '创建角色失败, 该角色已存在!',
      })
    } catch (e) {
      next(e)
    }
  }
}

export default RoleController
