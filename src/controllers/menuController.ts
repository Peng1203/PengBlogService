import { Request, Response, NextFunction } from 'express'
import MenuService from '../services/menuService'
import { AddMenuDTO, GetMenusListDTO, UpdateMenuDTO } from '../dtos/menuDTO'
import { validateOrRejectDTO } from '../helpers/validateParams'
import MyError from '../helpers/exceptionError'
import { PARAMS_ERROR_CODE } from '../helpers/errorCode'
class MenuController {
  private menuService = new MenuService()

  /**
   * 获取菜单列表
   * @author Peng
   * @date 2023-04-06
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public getMenuList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(GetMenusListDTO, req.query)
      const { data, total } = await this.menuService.findMenuList(
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
   * 添加菜单
   * @author Peng
   * @date 2023-04-07
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public addMenu = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(AddMenuDTO, req.body)

      const addRes = await this.menuService.createdMenu(req.body)
      res.send({
        code: 200,
        message: addRes ? 'Success' : 'Failed',
        data: addRes ? '菜单添加成功!' : '菜单添加失败, 该菜单已存在!',
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 通过ID删除菜单
   * @author Peng
   * @date 2023-04-08
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public delMenu = async (
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
          '菜单id参数有误!',
          'DTO'
        )

      const findRes = await this.menuService.findMenuById(id)
      if (!findRes)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '删除失败,未找到相关菜单信息!',
        })

      const delRes = await this.menuService.deleteMenuById(id)
      res.send({
        code: 200,
        message: delRes ? 'Success' : 'Failed',
        data: delRes ? '菜单删除成功!' : '菜单删除失败!',
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 通过ID更新菜单信息
   * @author Peng
   * @date 2023-04-08
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public updateMenu = async (
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
          '菜单id参数有误!',
          'DTO'
        )

      await validateOrRejectDTO(UpdateMenuDTO, req.body)
      const findRes = await this.menuService.findMenuById(id)
      if (!findRes)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '更新失败,未找到相关菜单信息!',
        })

      // 判断更新的字段除当前菜单以外 是否已经存在 确保更新后的一些唯一标识字段的唯一性

      const updateRes = await this.menuService.updateMenuById(id, req.body)

      res.send({
        code: 200,
        message: updateRes ? 'Success' : 'Failed',
        data: updateRes ? '更新菜单成功!' : '更新菜单失败!',
      })
    } catch (e) {
      next(e)
    }
  }
}

export default MenuController
