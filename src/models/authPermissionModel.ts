import sequelize from '../db/sequelize'
import { DataTypes, Sequelize } from 'sequelize'
import { dateTimeFormat } from '../utils/moment'

/**
 * 创建操作权限模型
 * @author Peng
 * @date 2023-04-09
 */

const AuthPermissionModel = sequelize.define(
  'AuthPermission',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    permissionName: {
      field: 'permission_name',
      type: DataTypes.CHAR,
      allowNull: false,
    },
    permissionCode: {
      field: 'permission_code',
      type: DataTypes.CHAR,
      allowNull: false,
    },
    desc: {
      field: 'description',
      type: DataTypes.CHAR,
      defaultValue: '',
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
  {
    tableName: 'auth_permission',
    timestamps: false,
  }
)

async function test() {
  const findRes = await AuthPermissionModel.findAll()
  const data = findRes.map(item => item.toJSON())
  console.log('data -----', data)
}

// test()
export default AuthPermissionModel
