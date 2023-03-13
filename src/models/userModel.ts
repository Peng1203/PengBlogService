import { DataTypes, Sequelize } from 'sequelize'
import { dateTimeFormat } from '../utils/moment'
import sequelize from '../db/sequelize'
import RoleModel from './roleModel'

/**
 * 创建用户模型
 * @author Peng
 * @date 2023-03-10
 */
const UserModel = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    roleId: {
      field: 'role_id',
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    userName: {
      field: 'user_name',
      type: DataTypes.CHAR,
      allowNull: false,
    },
    password: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    email: {
      type: DataTypes.CHAR,
    },
    // 用户状态 1正常 2锁定 3封禁
    state: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 3,
      },
    },
    createdTime: {
      field: 'created_time',
      type: DataTypes.DATE,
      allowNull: false,
      // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      // 获取创建日期时格式化 返回
      get() {
        return dateTimeFormat(this.getDataValue('created_time'))
      },
    },
    updateTime: {
      field: 'update_time',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      // 获取创建日期时格式化 返回
      get() {
        return dateTimeFormat(this.getDataValue('update_time'))
      },
    },
    // 用户头像
    avatar: {
      type: DataTypes.BLOB,
    },
    // 账户解封日期
    unsealTime: {
      field: 'unseal_time',
      type: DataTypes.DATE,
    },
  },
  // 模型配置属性
  {
    tableName: 'user',
    timestamps: false,
  }
)

UserModel.belongsTo(RoleModel, { foreignKey: 'id' })

export default UserModel
