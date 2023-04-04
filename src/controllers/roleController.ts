import { Request, Response, NextFunction } from 'express'
import RoleService from '../services/roleService'
import { validateOrRejectDTO } from '../helpers/validateParams'
import { GetRoleListDTO } from '../dtos/roleDTO'

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
}

export default RoleController
