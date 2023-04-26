import { DataTypes, Sequelize } from 'sequelize'
import { dateTimeFormat } from '../utils/moment'
import sequelize from '../db/sequelize'

/**
 * 创建文章分类模型
 * @author Peng
 * @date 2023-04-25
 */

const CategoryModel = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    categoryName: {
      field: 'category_name',
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true,
    },
    categoryDesc: {
      field: 'category_desc',
      type: DataTypes.CHAR,
      defaultValue: '',
    },
    createdTime: {
      field: 'created_time',
      type: DataTypes.DATE,
      allowNull: false,
      // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      // 获取创建日期时格式化 返回
      get() {
        return dateTimeFormat(this.getDataValue('createdTime'))
      },
    },
    updateTime: {
      field: 'update_time',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      // 获取创建日期时格式化 返回
      get() {
        return dateTimeFormat(this.getDataValue('updateTime'))
      },
    },
  },
  {
    tableName: 'category',
    timestamps: false,
  }
)

async function test() {
  const findRes = await CategoryModel.findAll()
  const data = findRes.map(row => row.toJSON())
  console.log('data -----', data)
}
// test()

export default CategoryModel
