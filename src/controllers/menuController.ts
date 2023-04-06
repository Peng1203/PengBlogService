import { Request, Response, NextFunction } from 'express'
import MenuService from '../services/menuService'
import { GetMenusListDTO } from '../dtos/menuDTO'
import { validateOrRejectDTO } from '../helpers/validateParams'
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
}

export default MenuController
