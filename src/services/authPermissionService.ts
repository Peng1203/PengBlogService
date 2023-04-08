import { Op } from 'sequelize'
import AuthPermissionModel from '../models/authPermissionModel'
import { ListResponse } from '../interfaces/Common'
import { ListParamsType } from '../types/Common'

/**
 * 定义service 权限标识类
 */
class AuthPermissionService {
  /**
   * 查询权限标识列表
   * @author Peng
   * @date 2023-04-09
   * @param {any} params:ListParamsType
   * @returns {any}
   */
  async findAuthPermissionList(params: ListParamsType): Promise<ListResponse> {
    try {
      const { page, pageSize, queryStr, column, order } = params
      const { rows, count: total } = await AuthPermissionModel.findAndCountAll({
        where: {
          [Op.or]: [
            { permissionName: { [Op.like]: `%${queryStr}%` } },
            { permissionCode: { [Op.like]: `%${queryStr}%` } },
            { desc: { [Op.like]: `%${queryStr}%` } },
          ],
        },
        offset: (page - 1) * pageSize,
        limit: pageSize,
        order: [[column || 'id', order || 'ASC']],
      })
      const data: any[] = rows.map(row => row.toJSON())
      return { data, total }
    } catch (e) {
      throw e
    }
  }
}

export default AuthPermissionService
