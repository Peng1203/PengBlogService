import { Sequelize } from 'sequelize'
import dbConfig from '../configs/mysqlConfig'

/**
 * 创建 sequelize 数据库实例
 * @author Peng
 * @date 2023-02-26
 * @type {Sequelize}
 */
const sequelize = new Sequelize({
  ...dbConfig,
  dialect: 'mysql',
  logging: false,
  // logging: console.log,
  timezone: '+08:00', // 设置时区为北京时间
})

// 测试连接
sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL 连接成功')
  })
  .catch(e => {
    console.error('MySQL 连接失败', e)
  })

export default sequelize
