import { Op } from 'sequelize'
import TagModel from '../models/tagModel'
import { ListResponse } from '../interfaces/Common'
import { ListParamsType } from '../types/Common'
/**
 * 定义 标签service类
 */
class TagService {
  /**
   * 查询标签列表
   * @author Peng
   * @date 2023-04-25
   * @param {any} params:ListParamsType
   * @returns {any}
   */
  async findTagList(params: ListParamsType): Promise<ListResponse> {
    try {
      const { page, pageSize, queryStr, column, order } = params
      const { rows, count: total } = await TagModel.findAndCountAll({
        where: {
          [Op.or]: [
            // { id: { [Op.like]: `%${queryStr}%` } },
            { tagName: { [Op.like]: `%${queryStr}%` } },
            { tagDesc: { [Op.like]: `%${queryStr}%` } },
          ],
        },
        offset: (page - 1) * pageSize,
        limit: pageSize,
        order: [[column || 'id', order || 'ASC']],
      })
      const data = rows.map(row => row.toJSON())
      return { data, total }
    } catch (e) {
      throw e
    }
  }

  /**
   * 通过标签ID查询 判断是否已经存在当前标签
   * @author Peng
   * @date 2023-04-25
   * @param {any} name:string
   * @param {any} id:number
   * @returns {any}
   */
  async findTagById(id: number): Promise<boolean> {
    try {
      // 修改时 id参数 用于过滤查出来去除自身
      const findRes = await TagModel.findByPk(id)
      return !!findRes
    } catch (e) {
      throw e
    }
  }

  /**
   * 创建新标签
   * @author Peng
   * @date 2023-04-25
   * @returns {any}
   */
  async createdTag(tagInfo: any): Promise<boolean> {
    try {
      const [result, isCreated] = await TagModel.findOrCreate({
        where: {
          tagName: tagInfo.tagName,
        },
        defaults: tagInfo,
      })
      return isCreated
    } catch (e) {
      throw e
    }
  }

  /**
   * 通过ID更新标签信息
   * @author Peng
   * @date 2023-04-25
   * @param {any} id:number
   * @param {any} tagInfo:any
   * @returns {any}
   */
  async editTagById(id: number, tagInfo: any): Promise<number> {
    try {
      const updataRes = await TagModel.update(tagInfo, { where: { id } })
      return updataRes[0]
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') return 2
      throw e
    }
  }

  /**
   * 通过ID删除标签
   * @author Peng
   * @date 2023-04-25
   * @param {any} id:number
   * @returns {any}
   */
  async deleteTagById(id: number): Promise<boolean> {
    try {
      return !!(await TagModel.destroy({ where: { id } }))
    } catch (e) {
      throw e
    }
  }
}

export default TagService
