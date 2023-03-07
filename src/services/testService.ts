import { Op } from 'sequelize'
import TestModel from '../models/testModel'
import { dateTimeFormat } from '../utils/moment'

// 提交参数
type PostType = {
  userName: string
  age: string
  data: string
}

// 查询参数
type queryParamsType = {
  page?: number
  pageSize?: number
  queryStr?: string
  column?: string
  order?: 'ASC' | 'DESC' | ''
}

/**
 * 定义service 测试类
 */
class TestService {
  /**
   * ID查询测试模型数据
   * @author Peng
   * @date 2023-03-03
   * @param {any} id:string|number
   * @returns {any}
   */
  public async getTestInfoByID(id: string | number): Promise<object | null> {
    try {
      return await TestModel.findByPk(id)
    } catch (e) {
      throw new Error('查询失败!')
    }
  }

  /**
   * 创建测试模型数据
   * @author Peng
   * @date 2023-03-03
   * @param {any} data:PostType
   * @returns {any}
   */
  public async createdTestData(data: PostType): Promise<any> {
    try {
      const _data = {
        ...data,
        createdTime: dateTimeFormat(),
      }
      console.log('_data -----', _data)
      return await TestModel.create(_data)
    } catch (e) {
      throw new Error('创建测试数据失败!')
    }
  }

  /**
   * 查询测试数据
   * @author Peng
   * @date 2023-03-04
   * @param {any} params?:queryParamsType
   * @returns {any}
   */
  public async getTestList(params?: queryParamsType): Promise<any> {
    try {
      console.log('params -----', params)
      const { page, pageSize, queryStr, column, order } = params ?? {}
      const where = queryStr
        ? {
            [Op.or]: [
              { userName: { [Op.like]: `%${queryStr}%` } },
              { data: { [Op.like]: `%${queryStr}%` } },
            ],
          }
        : {}

      const options =
        page && pageSize
          ? {
              limit: pageSize,
              offset: (page - 1) * pageSize,
            }
          : {}

      const result = await TestModel.findAndCountAll({
        where,
        ...options,
        // 字段排序 ASC DESC
        order: [[column || 'id', order || 'ASC']],
      })
      const total = await TestModel.count()
      return { ...result, total }
    } catch (e) {
      throw new Error('查询数据失败!')
    }
  }

  public async updateTestInfo(id: string | number, data: object): Promise<any> {
    try {
      console.log('servic层 -----', id, data)
      return await TestModel.update(data, {
        where: { id },
      })
    } catch (e) {
      throw new Error('更新数据失败')
    }
  }

  public async deleteTestInfo(id: string | number) {
    try {
      return await TestModel.destroy({
        where: { id },
      })
    } catch (e) {
      console.log(e)
    }
  }
}

export default TestService
