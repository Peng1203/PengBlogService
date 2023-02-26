import TestModel from '../models/testModel'

// 提交参数限制
type PostType = {
  userName: '',
  age: '',
  data: '',
}
/** 
 * 定义service 测试类
 */
class TestService {
  /**
   * 新增数据
   */
  public async createdTestData(data: PostType): Promise<any> {
    try {
      console.log('data -----', data)
      const res = await TestModel.create(data)
      console.log('res -----', res)
      return res
    } catch (e) {
      console.log(e)
    }
  }
}

export default TestService