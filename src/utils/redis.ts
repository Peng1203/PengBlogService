
import redis from 'ioredis'
import config from '../configs/redis.config'
// 创建Redis终端
const redisClient = new redis(config)

/**
 * 设置缓存
 * @author Peng
 * @date 2023-02-23
 * @param {string} key
 * @param {any} value
 * @param {number} second
 * @result 返回结果 OK
 * @returns {Promise}
 */
async function setCache<T extends string | Error | null>(key: string, value: any, second: number | undefined): Promise<T> {
  try {
    if (typeof value === "object") value = JSON.stringify(value)
    if (second === undefined) {
      // 没有时间限制缓存
      return await redisClient.set(key, value) as T
    } else {
      // 有时间限制缓存 过期自动删除
      return await redisClient.setex(key, second, value) as unknown as T
    }
  } catch (error) {
    throw error
  }
}


/**
 * 获取缓存
 * @author Peng
 * @date 2023-02-23
 * @param {string} key
 * @result 返回结果 成功{查询结果} 失败null
 * @returns {Promise}
 */
async function getCache<T>(key: string): Promise<T | null> {
  try {
    const result = await redisClient.get(key);
    return result ? (result as T) : null;
  } catch (error) {
    throw error
  }
}


/**
 * 删除缓存
 * @author Peng
 * @date 2023-02-23
 * @param {string} key
 * @result 返回结果 成功true 失败false
 * @returns {Boolean}
 */
async function delCache<T extends string>(key: T): Promise<boolean> {
  try {
    // 成功1 失败0
    return !!(await redisClient.del(key))
  } catch (error) {
    throw error
  }
}


/**
 * 判断缓存 是否已经存在
 * @author Peng
 * @date 2023-02-23
 * @param {string} key
 * @result 返回结果 成功true 失败false
 * @returns {Boolean}
 */
async function isExists<T extends boolean | Error>(key: string): Promise<T> {
  let exists: boolean
  try {
    // 存在1 不存在0
    exists = await redisClient.exists(key) ? true : false
  } catch (error) {
    throw error
  }
  return exists as T
}



/**
 * 自增计数器 设置存储值自增+1 用于统计访问量等数据
 * @author Peng
 * @date 2023-02-23
 * @param {string} counterKey
 * @result 返回结果 成功 当前统计数量 
 * @returns {Number}
 */
async function incrCounter<T extends number | Error>(counterKey: string): Promise<T> {
  try {
    return await redisClient.incr(counterKey) as T
  } catch (error) {
    throw error
  }
}


/**
 * 测试
 * @author Peng
 * @date 2023-02-23
 * @returns {void}
 */
async function test() {
  // console.log('redisClient -----', redisClient)
  const status = await setCache('test', { name: '张三' }, 100)
  // const status = await setCaches({ key4: '哈', key5: '哈哈', key6: '哈哈哈' }, 100)
  console.log('设置缓存 -----', status) // OK

  const res = await getCache('test')
  console.log('获取缓存 -----', JSON.parse(res as string)) // 成功 value 失败 null

  const delStatus = await delCache('test1') // 删除 成功1 失败0
  console.log('删除缓存 -----', delStatus)

  const isExist = await isExists('key5') // 存在true 不存在false
  console.log('isExist -----', isExist)

  const result = await incrCounter('testCounter')
  console.log('result -----', result)

  const testCounter = await getCache('testCounter')
  console.log('testCounter -----', testCounter)

  redisClient.quit()
}
test()

module.exports = {
  redisClient,
  setCache,
  getCache,
  delCache,
  isExists,
  incrCounter
}