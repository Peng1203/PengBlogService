const redis = require('redis');
const config = require('../configs/redis.config')
// 创建Redis终端
const redisClient = redis.createClient(config)

/**
 * 设置缓存
 * @author Peng
 * @date 2023-02-23
 * @param {any} key
 * @param {any} value
 * @param {Number} second
 * @result 返回结果 OK
 * @returns {Promise}
 */
function setCache(key, value, second) {
  if (typeof value === "object") value = JSON.stringify(value)
  return new Promise((resolve, reject) => {
    if (second === undefined) {
      // 没有时间限制缓存
      redisClient.set(key, value, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    } else {
      // 有时间限制缓存 过期自动删除
      redisClient.setex(key, second, value, (err, res) => {
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
 * @result 返回结果 成功{查询结果} 失败null
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
 * @result 返回结果 成功true 失败false
 * @returns {Boolean}
 */
function delCache(key) {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err, res) => {
      if (err) reject(err)
      else resolve(res ? true : false)
    })
  })
}


/**
 * 判断缓存 是否已经存在
 * @author Peng
 * @date 2023-02-23
 * @param {String} key
 * @result 返回结果 成功true 失败false
 * @returns {Boolean}
 */
function isExists(key) {
  return new Promise((resolve, reject) => {
    redisClient.exists(key, (err, reply) => {
      if (err) reject(err)
      // 存在1 不存在0
      else resolve(reply ? true : false)
    })
  })
}


/**
 * 自增计数器 设置存储值自增+1 用于统计访问量等数据
 * @author Peng
 * @date 2023-02-23
 * @param {String} key
 * @result 返回结果 成功 当前统计数量 
 * @returns {Number}
 */
function incrCounter(key) {
  return new Promise((resolve, reject) => {
    redisClient.incr(key, (err, res) => {
      if (err) reject(err)
      else resolve(res)
      // else resolve(res && true)
    })
  })
}


/**
 * 测试
 * @author Peng
 * @date 2023-02-23
 * @returns {void}
 */
async function test() {
  console.log('redisClient -----', redisClient)
  const status = await setCache('test', { name: '张三' }, 100)
  // const status = await setCaches({ key4: '哈', key5: '哈哈', key6: '哈哈哈' }, 100)
  console.log('status -----', status) // OK

  const res = await getCache('test')
  console.log('res -----', JSON.parse(res)) // 成功 value 失败 null

  const delStatus = await delCache('test11') // 删除 成功1 失败0
  console.log('delStatus -----', delStatus)

  const isExist = await isExists('key5') // 存在true 不存在false
  console.log('isExist -----', isExist)

  const result = await incrCounter('testCounter')
  console.log('result -----', result)

  const testCounter = await getCache('testCounter')
  console.log('testCounter -----', testCounter)
}
// test()

module.exports = {
  redisClient,
  setCache,
  getCache,
  delCache,
  isExists,
  incrCounter
}