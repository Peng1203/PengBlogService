import { Op } from 'sequelize'
import CategoryModel from '../models/categoryModel'
import { ListResponse } from '../interfaces/Common'
import { ListParamsType } from '../types/Common'
/**
 * 定义 分类service类
 */
class CategoryService {
  /**
   * 查询分类列表
   * @author Peng
   * @date 2023-04-26
   * @param {any} params:ListParamsType
   * @returns {any}
   */
  async findCategoryList(params: ListParamsType): Promise<ListResponse> {
    try {
      const { page, pageSize, queryStr, column, order } = params
      const { rows, count: total } = await CategoryModel.findAndCountAll({
        where: {
          [Op.or]: [
            // { id: { [Op.like]: `%${queryStr}%` } },
            { categoryName: { [Op.like]: `%${queryStr}%` } },
            { categoryDesc: { [Op.like]: `%${queryStr}%` } },
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
   * 通过分类ID查询 判断是否已经存在当前分类
   * @author Peng
   * @date 2023-04-26
   * @param {any} name:string
   * @param {any} id:number
   * @returns {any}
   */
  async findCategoryById(id: number): Promise<boolean> {
    try {
      // 修改时 id参数 用于过滤查出来去除自身
      const findRes = await CategoryModel.findByPk(id)
      return !!findRes
    } catch (e) {
      throw e
    }
  }

  /**
   * 创建新分类
   * @author Peng
   * @date 2023-04-26
   * @returns {any}
   */
  async createdCategory(categoryInfo: any): Promise<boolean> {
    try {
      const [result, isCreated] = await CategoryModel.findOrCreate({
        where: {
          categoryName: categoryInfo.categoryName,
        },
        defaults: categoryInfo,
      })
      return isCreated
    } catch (e) {
      throw e
    }
  }

  /**
   * 通过ID更新分类信息
   * @author Peng
   * @date 2023-04-26
   * @param {any} id:number
   * @param {any} categoryInfo:any
   * @returns {any}
   */
  async editCategoryById(id: number, categoryInfo: any): Promise<number> {
    try {
      const updataRes = await CategoryModel.update(categoryInfo, {
        where: { id },
      })
      return updataRes[0]
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') return 2
      throw e
    }
  }

  /**
   * 通过ID删除分类
   * @author Peng
   * @date 2023-04-26
   * @param {any} id:number
   * @returns {any}
   */
  async deleteCategoryById(id: number): Promise<boolean> {
    try {
      return !!(await CategoryModel.destroy({ where: { id } }))
    } catch (e) {
      throw e
    }
  }
}

export default CategoryService
