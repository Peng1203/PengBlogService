import sequelize from '../db/sequelize'
import { DataTypes, Sequelize } from 'sequelize'
import { dateTimeFormat } from '../utils/moment'

/**
 * 创建角色模型
 * @author Peng
 * @date 2023-03-10
 */
const RoleModel = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    roleName: {
      field: 'role_name',
      type: DataTypes.CHAR,
      allowNull: false,
    },
    roleDesc: {
      field: 'role_desc',
      type: DataTypes.CHAR,
      defaultValue: '',
    },
    // 菜单标识数组
    menus: {
      type: DataTypes.JSON,
      defaultValue: () => [],
    },
    // 操作权限标识数组
    operationPermissions: {
      field: 'auth_permissions',
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
    tableName: 'role',
    timestamps: false,
  }
)

async function test() {
  // const findRes = await (await RoleModel.findAll()).map(result => result.toJSON());
  // console.log('findRes -----', (findRes))

  // const roles = {
  //   createdTime: '2023-03-18 16:03:37',
  //   updateTime: '2023-03-18 16:03:37',
  //   id: 1,
  //   roleName: 'administrator',
  //   roleDesc: '超级管理员',
  //   menus: [],
  //   operationPermissions: []
  // }

  const newRole = {
    roleName: 'test1',
    roleDesc: '测试角色1',
  }
  const addRes = await RoleModel.create(newRole)
  console.log('插入结果 -----', addRes)
}
// test()

export default RoleModel
