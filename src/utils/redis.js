const redis = require('redis');
const config = require('../configs/redis.config')

const redisClient = redis.createClient(config)

/**
 * 设置缓存
 * @author Peng
 * @date 2023-02-23
 * @param {any} key
 * @param {any} value
 * @param {any} time
 * @returns {Promise}
 */
function setCache(key, value, time) {
  if (typeof value === "object") value = JSON.stringify(value)
  return new Promise((resolve, reject) => {
    if (time === undefined) {
      // 没有时间限制缓存
      redisClient.set(key, value, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    } else {
      // 有时间限制缓存 过期自动删除
      redisClient.setex(key, time, value, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    }
  })
}

/**
 * 获取缓存
 * @author Peng
 * @date 2023-02-23
 * @param {any} key
 * @returns {Promise}
 */
function getCache(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}


/**
 * 删除缓存
 * @author Peng
 * @date 2023-02-23
 * @param {any} key
 * @returns {Promise}
 */
function delCache(key) {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}

// setCache('test', { name: '张三' }).then(res => {
//   console.log('res -----', res)
// })

module.exports = {
  redisClient,
  setCache,
  getCache,
  delCache
}