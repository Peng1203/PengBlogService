import sequelize from '../db/sequelize'
import { DataTypes, Sequelize } from 'sequelize'
import { dateTimeFormat } from '../utils/moment'

const MenuModel = sequelize.define(
  'Menu',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    menuName: {
      field: 'menu_name',
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true,
    },
    // 用于保存前端定义的 路由访问路径
    menuPath: {
      field: 'menu_path',
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true,
    },
    menuURI: {
      field: 'menu_uri',
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true,
    },
    menuIcon: {
      field: 'menu_icon',
      type: DataTypes.CHAR,
      defaultValue: '',
    },
    // 父级ID参数 0为 一级菜单
    parentId: {
      field: 'parent_id',
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    // 拥有菜单的角色id列表
    roles: {
      type: DataTypes.JSON,
      defaultValue: () => [],
    },
    createdTime: {
      field: 'created_time',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      get() {
        return dateTimeFormat(this.getDataValue('createdTime'))
      },
    },
    updateTime: {
      field: 'update_time',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      get() {
        return dateTimeFormat(this.getDataValue('updateTime'))
      },
    },
  },
  // 模型配置属性
  {
    tableName: 'menu',
    timestamps: false,
  }
)

async function test() {
  // const findRes = await MenuModel.findAll()
  // console.log(
  //   'findRes -----',
  //   findRes.map(res => res.toJSON())
  // )
  const addMenu = {
    menuName: '个人中心',
    menuPath: '/personal',
    menuURI: 'personal',
    parentId: 0,
    roles: [],
  }
  const addRes = await MenuModel.create(addMenu)
  console.log('addRes -----', addRes)
}
// test()

export default MenuModel
