import { DataTypes, Sequelize } from 'sequelize'
import { dateTimeFormat } from '../utils/moment'
import sequelize from '../db/sequelize'

/**
 * 创建文章模型
 * @author Peng
 * @date 2023-04-26
 */

const ArticleModel = sequelize.define(
  'Article',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    // 文章封面
    cover: {
      type: DataTypes.CHAR,
      defaultValue: '',
    },
    // 分类ID
    categoryId: {
      field: 'c_id',
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    // 文章标签 JSON数组
    tags: {
      type: DataTypes.JSON,
      defaultValue: () => [],
    },
    // 评论数
    commentCount: {
      field: 'comment_count',
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    // 点赞数
    likeCount: {
      field: 'like_count',
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    // 点踩数
    dislikeCount: {
      field: 'dislike_count',
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    // 阅读量
    viewCount: {
      field: 'view_count',
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    // 文章状态 (保留字段)
    state: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
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
    tableName: 'article',
    timestamps: false,
  }
)

async function test() {
  const rows = await ArticleModel.findAll({ where: { id: 2 } })
  const data = rows.map(row => row.toJSON())
  console.log('data -----', data)
}

// test()

export default ArticleModel
