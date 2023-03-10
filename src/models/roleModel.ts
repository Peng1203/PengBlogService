import sequelize from '../db/sequelize'
import { DataTypes } from 'sequelize'

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
    },
  },
  // 模型配置属性
  {
    tableName: 'role',
    timestamps: false,
  }
)

export default RoleModel
