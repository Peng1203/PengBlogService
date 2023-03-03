import TestModel from '../models/testModel'
import { dateTimeFormat } from '../utils/moment'
// 提交参数限制
type PostType = {
  userName: ''
  age: ''
  data: ''
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
}

export default TestService
