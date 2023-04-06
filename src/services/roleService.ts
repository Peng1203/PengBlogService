import RoleModel from '../models/roleModel'
import { RoleListItemInfo } from '../interfaces/Role'
import { Op } from 'sequelize'
import { ListResponse } from '../interfaces/Common'
import { AddRoleType } from '../types/Role'

/**
 * 定义service 角色类
 */
class RoleService {
  /**
   * 查询全部角色列表
   * @author Peng
   * @date 2023-04-04
   * @param {any} queryInfo:object
   * @returns {any}
   */
  async findRoleList(params: object): Promise<ListResponse> {
    try {
      const { page, pageSize, queryStr, column, order } = params as any
      const { rows, count: total } = await RoleModel.findAndCountAll({
        where: {
          [Op.or]: [
            { id: { [Op.like]: `%${queryStr}%` } },
            { roleName: { [Op.like]: `%${queryStr}%` } },
          ],
        },
        offset: (page - 1) * pageSize,
        limit: pageSize,
        attributes: { exclude: ['password', 'avatar'] },
        order: [[column || 'id', order || 'ASC']],
      })
      const data: RoleListItemInfo[] = rows.map(row => row.toJSON())
      return { data, total }
    } catch (e) {
      throw e
    }
  }

  /**
   * 通过ID查询 角色是否存在
   * @author Peng
   * @date 2023-04-05
   * @param {any} id:number
   * @returns {any}
   */
  async findRoelById(id: number): Promise<boolean> {
    try {
      return !!(await RoleModel.findByPk(id))
    } catch (e) {
      throw e
    }
  }

  /**
   * 添加角色 判断是否存在当前角色 不存在则创建
   * @author Peng
   * @date 2023-04-05
   * @param {any} params:AddRoleType
   * @returns {any}
   */
  async createdRole(params: AddRoleType): Promise<boolean> {
    try {
      // 判断角色是否已经存在 isCreated根据是否创建 返回布尔类型 创建则返回true 未创建则返回false
      const [result, isCreated] = await RoleModel.findOrCreate({
        where: { roleName: (<{ roleName: string }>params).roleName },
        defaults: params,
      })
      // console.log('result -----', result.toJSON())
      return isCreated
    } catch (e) {
      throw e
    }
  }

  /**
   * 通过角色ID 删除角色
   * @author Peng
   * @date 2023-04-05
   * @param {any} id:number
   * @returns {any}
   */
  async deleteRoleById(id: number): Promise<boolean> {
    try {
      return !!(await RoleModel.destroy({ where: { id } }))
    } catch (e) {
      throw e
    }
  }

  /**
   * 通过角色ID 更新角色信息
   * @author Peng
   * @date 2023-04-05
   * @param {any} id:number
   * @param {any} params:Object
   * @returns {any}
   */
  async updateRoleInfoById(id: number, params: Object): Promise<boolean> {
    try {
      const updateRes = await RoleModel.update(params, { where: { id } })
      return !!updateRes[0]
    } catch (e) {
      throw e
    }
  }
}

export default RoleService
