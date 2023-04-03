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
      defaultValue: 1,
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
    // 用户头像
    avatar: {
      type: DataTypes.BLOB('long'),
      defaultValue: null,
      allowNull: true,
      get() {
        if (!this.getDataValue('avatar')) return null
        return `data:image/png;base64,${this.getDataValue('avatar').toString(
          'base64'
        )}`
      },
    },
    // 账户解封日期
    unsealTime: {
      field: 'unseal_time',
      type: DataTypes.DATE,
      defaultValue: null,
      get() {
        if (this.getDataValue('unsealTime') === null) return null
        return dateTimeFormat(this.getDataValue('unsealTime'))
      },
    },
  },
  // 模型配置属性
  {
    tableName: 'user',
    timestamps: false,
  }
)

UserModel.belongsTo(RoleModel, { foreignKey: 'id' })

async function test() {
  const userInfo = {
    userName: '李四',
    password: '5100',
    roleId: 1,
  }
  const res = await UserModel.create(userInfo)
  console.log('添加用户信息 -----', res.toJSON())
  // const finRes = await UserModel.findOne({
  //   where: {
  //     userName: 'test',
  //   },
  // })
  // console.log('finRes -----', finRes.toJSON())
}

// test()

export default UserModel
