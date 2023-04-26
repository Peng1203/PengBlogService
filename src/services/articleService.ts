import { Op } from 'sequelize'
import ArticleModel from '../models/articleModel'
import CategoryModel from '../models/categoryModel'
import TagModel from '../models/tagModel'
import UserModel from '../models/userModel'
import { ListResponse } from '../interfaces/Common'
import { ListParamsType } from '../types/Common'
/**
 * 定义 分类service类
 */
class ArticleService {
  /**
   * 查询分类列表
   * @author Peng
   * @date 2023-04-26
   * @param {any} params:ListParamsType
   * @returns {any}
   */
  async findArticleList(params: ListParamsType): Promise<ListResponse> {
    try {
      //
      const {
        page,
        pageSize,
        queryStr,
        column,
        order,
        authorIds,
        cId,
        tagId,
        startTime,
        endTime,
      } = params
      // 作者过滤条件 当数组为空时 查询全部
      const authorFilter = authorIds.length
        ? { authorId: { [Op.in]: authorIds } }
        : {}

      // 分类过滤条件
      const categoryFilter = cId ? { categoryId: cId } : {}

      // 归档查询条件 按照创建时间来查询 指定时间段创建的文章
      const archivalFilter =
        startTime && endTime
          ? {
              createdTime: {
                [Op.between]: [startTime, endTime],
              },
            }
          : {}
      const { rows, count: total } = await ArticleModel.findAndCountAll({
        where: {
          ...authorFilter,
          ...categoryFilter,
          // tags: {
          //   [Op.like]: `%${tagId}%`,
          // },
          [Op.or]: [
            { title: { [Op.like]: `%${queryStr}%` } },
            { brief: { [Op.like]: `%${queryStr}%` } },
          ],
          ...archivalFilter,
        },
        include: [
          {
            model: CategoryModel,
            attributes: ['id', 'categoryName'],
          },
          {
            model: UserModel,
            attributes: ['id', 'userName'],
          },
        ],
        attributes: { exclude: ['categoryId', 'content'] },
        offset: (page - 1) * pageSize,
        limit: pageSize,
        order: [[column || 'id', order || 'ASC']],
      })
      let data = rows.map(row => {
        const info = row.toJSON()
        const { id: categoryId, categoryName } = info?.Category
        const { id: authorId, userName: authorName } = info?.User
        const formatData = {
          ...info,
          categoryId,
          categoryName,
          authorId,
          authorName,
        }
        delete formatData?.Category
        delete formatData?.User
        return formatData
      })
      // 手动过滤出tagID 但无法获取到准确的total
      // if (tagId) data = data.filter(item => item.tags.includes(tagId))
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
  async findArticleById(id: number): Promise<boolean> {
    try {
      // 修改时 id参数 用于过滤查出来去除自身
      const findRes = await ArticleModel.findByPk(id)
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
  async createdArticle(articleInfo: any): Promise<boolean> {
    try {
      const [result, isCreated] = await ArticleModel.findOrCreate({
        where: {
          articleName: articleInfo.articleName,
        },
        defaults: articleInfo,
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
   * @param {any} articleInfo:any
   * @returns {any}
   */
  async editArticleById(id: number, articleInfo: any): Promise<number> {
    try {
      const updataRes = await ArticleModel.update(articleInfo, {
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
  async deleteArticleById(id: number): Promise<boolean> {
    try {
      return !!(await ArticleModel.destroy({ where: { id } }))
    } catch (e) {
      throw e
    }
  }
}

export default ArticleService