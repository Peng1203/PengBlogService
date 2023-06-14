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
    // 父级ID参数 0为一级菜单
    parentId: {
      field: 'parent_id',
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    // 拥有菜单的角色id列表
    // roles: {
    //   type: DataTypes.JSON,
    //   defaultValue: () => [],
    // },
    // 菜单类型 1一级目录 2 一级菜单  3目录 4菜单
    menuType: {
      field: 'menu_type',
      type: DataTypes.ENUM('1', '2', '3', '4'),
      defaultValue: '1',
      allowNull: false,
    },
    // 重定向菜单
    menuRedirect: {
      field: 'menu_redirect',
      type: DataTypes.CHAR,
      defaultValue: null,
      allowNull: true,
    },
    // 菜单其他配置信息
    otherConfig: {
      field: 'other_config',
      type: DataTypes.JSON,
      defaultValue: () => ({
        isKeepAlive: false,
        isHide: false,
        parentMenuName: '',
      }),
      allowNull: true,
      // get() {
      //   return JSON.parse(this.getDataValue('otherConfig'))
      // },
      // set(val) {
      //   this.setDataValue('otherConfig', JSON.stringify(val))
      // },
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
  // const addMenu = {
  //   menuName: '权限管理',
  //   menuPath: '/auth',
  //   menuIcon: 'iconfont icon-auth',
  //   menuURI: 'Auth',
  //   parentId: 0,
  //   menuType: '1',
  //   menuRedirect: 'SystemRole',
  //   otherConfig: { isKeepAlive: false, isHide: false },
  // }
  // const addRes = await MenuModel.create(addMenu)
  // console.log('addRes -----', addRes)

  const params = {
    menuName: '个人中心',
    menuPath: '/personal',
    menuURI: 'Personal',
    menuIcon: 'ele-UserFilled',
    parentId: 0,
    menuType: '3',
    menuRedirect: '',
    otherConfig: { isHide: true, isKeepAlive: true, parentMenuName: '' },
  }

  const res = await MenuModel.update(params, { where: { id: 13 } })
  console.log('res -----', res)
}
// test()

export default MenuModel
