import { DataTypes, Sequelize } from 'sequelize'
import { dateTimeFormat } from '../utils/moment'
import sequelize from '../db/sequelize'

/**
 * 创建文章标签模型
 * @author Peng
 * @date 2023-04-24
 */

const TagModel = sequelize.define(
  'Tag',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    tagName: {
      field: 'tag_name',
      type: DataTypes.CHAR,
      unique: true,
      allowNull: false,
    },
    tagIcon: {
      field: 'tag_icon',
      type: DataTypes.CHAR,
      defaultValue: '',
    },
    tagDesc: {
      field: 'tag_desc',
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
    tableName: 'tag',
    timestamps: false,
  }
)

async function test() {
  // const findRes = await TagModel.findAll()
  // // console.log('findRes -----', findRes)
  // const data = findRes.map(row => row.toJSON())
  // console.log('data -----', data)
  // const tag = {
  //   tagName: 'Vue',
  //   tagIcon: 'iconfont icon-vue',
  //   tagDesc: 'Vue.js是一个前端框架',
  //   createdTime: '2023-04-23 01:22:09',
  //   updateTime: '2023-04-23 01:22:09'
  // }
  // const addRes = await TagModel.create(tag)
  // console.log('addRes -----', addRes.toJSON())
  // const updateInfo = {
  //   tagName: 'Vue3',
  //   tagDesc: 'Vue.js 是一个渐进式JavaScript框架',
  //   createdTime: '2023-04-23 01:22:09',
  //   updateTime: '2023-04-23 01:22:09'
  // }
  // const updateRes = await TagModel.update(updateInfo, {
  //   where: { id: 1 }
  // })
  // console.log('updateRes -----', updateRes, updateRes[0])
  // const ids = []
  // for (let i = 2; i < 15; i++) {
  //   ids.push(i)
  // }
  // console.log('ids -----', ids)
  // const delRes = await TagModel.destroy({ where: { id: ids } })
  // console.log('delRes -----', delRes)
}

// test()

export default TagModel
