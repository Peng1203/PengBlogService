import { DataTypes, Sequelize } from 'sequelize'
import { dateTimeFormat } from '../utils/moment'
import sequelize from '../db/sequelize'

/**
 * 创建用户模型
 * @author Peng
 * @date 2023-03-10
 */
const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userName: {
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
    type: DataTypes.DATE,
    allowNull: false,
    // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    defaultValue: dateTimeFormat(),
    // 获取创建日期时格式化 返回
    get() {
      return dateTimeFormat(this.getDataValue('createdTime'))
    },
  },
  updateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: dateTimeFormat(),
    // 获取创建日期时格式化 返回
    get() {
      return dateTimeFormat(this.getDataValue('updateTime'))
    },
  },
  // 用户头像
  avatar: {
    type: DataTypes.BLOB,
  },
  // 账户解封日期
  unsealingTime: {
    type: DataTypes.DATE,
    // defaultValue: '',
    get() {
      const unsealingTime = this.getDataValue('unsealingTime')
      if (!unsealingTime) return unsealingTime
      return dateTimeFormat(unsealingTime)
    },
  },
})

export default UserModel
