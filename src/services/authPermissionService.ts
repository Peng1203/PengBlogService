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

  /**
   * 创建权限标识 当存在时取消创建操作
   * @author Peng
   * @date 2023-04-09
   * @param {any} params:any
   * @returns {any}
   */
  async createdAuthPermission(params: any): Promise<boolean> {
    try {
      const { permissionName, permissionCode } = params
      const [result, isCreated] = await AuthPermissionModel.findOrCreate({
        where: {
          [Op.or]: [{ permissionName }, { permissionCode }],
        },
        defaults: params,
      })
      return isCreated
    } catch (e) {
      throw e
    }
  }
}

export default AuthPermissionService
