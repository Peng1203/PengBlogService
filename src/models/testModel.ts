import { dateTimeFormat } from '../utils/moment'
import { DataTypes, Sequelize } from 'sequelize'
import sequelize from '../db/sequelize'

/**
 * 创建测试模型
 * @author Peng
 * @date 2023-02-26
 */
const TestModel = sequelize.define(
  'Test',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    // 用户名
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 年龄
    age: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 120,
      },
    },
    // 数据
    data: DataTypes.CHAR,
    // 创建时间
    createdTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      // validate: {
      //   isISO8601: {
      //     args: ['YYYY-MM-DD HH:mm:ss'],
      //     message: 'createdTime field must be in format "YYYY-MM-DD HH:mm:ss"',
      //   },
      // },
      // 获取创建日期时格式化 返回
      get() {
        return dateTimeFormat(this.getDataValue('createdTime'))
      },
    },
  },
  // 模型配置属性
  {
    tableName: 'test',
    timestamps: false,
  }
)

// TestModel.create({
//   userName: '你好',
//   age: 12,
//   data: '哈哈哈哈哈哈',
//   // createdTime: '2023-02-26 23:00:00'
// }).then(() => { console.log('插入成功 -----',) })
//   .catch((err) => { console.log('插入失败 -----', err) })

export default TestModel
