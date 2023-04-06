import { Op } from 'sequelize'
import MenuModel from '../models/menuModel'
import { MenuListItemInfo } from '../interfaces/Menu'
import { ListResponse } from '../interfaces/Common'
import { ListParamsType } from '../types/Common'

/**
 * 定义service 菜单类
 */
class MenuService {
  /**
   * 查询菜单列表
   * @author Peng
   * @date 2023-04-06
   * @param {any} params:ListParamsType
   * @returns {any}
   */
  async findMenuList(params: ListParamsType): Promise<ListResponse> {
    try {
      const { page, pageSize, queryStr, column, order } = params
      const { rows, count: total } = await MenuModel.findAndCountAll({
        where: {
          [Op.or]: [
            { id: { [Op.like]: `%${queryStr}%` } },
            { menuName: { [Op.like]: `%${queryStr}%` } },
          ],
        },
        offset: (page - 1) * pageSize,
        limit: pageSize,
        order: [[column || 'id', order || 'ASC']],
      })
      const data: MenuListItemInfo[] = rows.map(row => row.toJSON())
      return { data, total }
    } catch (e) {
      throw e
    }
  }
}

export default MenuService
