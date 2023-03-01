import TestModel from '../models/testModel'
import moment from 'moment'
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
  public async getTestInfoByID(id: string | number): Promise<object | null> {
    return await TestModel.findByPk(id)
  }

  /**
   * 新增数据
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
      throw new Error('创建测试数据失败')
    }
  }
}

export default TestService
