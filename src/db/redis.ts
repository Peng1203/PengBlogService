import redis from 'ioredis'
import config from '../configs/redisConfig'
import { JSON_REGEX } from '../helpers/regex'
// 创建Redis终端
const redisClient = new redis(config)

redisClient.on('connect', () => {
  console.log('Redis 连接成功')
})
redisClient.on('error', () => {
  console.log('Redis 连接失败')
})
// redisClient.on('idle', () => {
//   console.log('ioredis idle-----')
// })
// redisClient.on('close', () => {
//   console.log('ioredis close-----')
// })
// redisClient.on('end', () => {
//   console.log('ioredis end-----')
// })

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
async function setCache<T extends string | Error | null>(
  key: string,
  value: any,
  second?: number | undefined
): Promise<T> {
  try {
    if (typeof value === 'object') value = JSON.stringify(value)
    if (second === undefined) {
      // 没有时间限制缓存
      return (await redisClient.set(key, value)) as T
    } else {
      // 有时间限制缓存 过期自动删除
      return (await redisClient.setex(key, second, value)) as unknown as T
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
async function getCache<T extends number | string>(
  key: string
): Promise<T | null> {
  try {
    let result = await redisClient.get(key)
    if (Number(result)) return Number(result) as T
    return result ? (result as T) : null
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
    exists = (await redisClient.exists(key)) ? true : false
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
async function incrCounter(
  counterKey: string,
  second?: number extends 0 ? never : number
): Promise<number> {
  try {
    const res = await redisClient.incr(counterKey)
    if (second !== undefined) redisClient.expire(counterKey, second)
    return res
  } catch (error) {
    throw error
  }
}

/**
 * 往指定集合当中添加一条数据 当集合不存在时则会自动创建 并添加
 * 集合中的值是唯一的 重复的 val 没有效果
 * @author Peng
 * @date 2023-03-08
 * @param {any} key:string
 * @param {any} ...values:Array<T>
 * @returns {boolean} 添加成功true 添加失败false
 */
async function addToSet<T extends string | number>(
  key: string,
  ...values: Array<T>
): Promise<boolean> {
  try {
    return !!(await redisClient.sadd(key, ...(values as Array<T>)))
  } catch (error) {
    throw error
  }
}

/**
 * 获取集合
 * @author Peng
 * @date 2023-03-08
 * @param {any} key:string
 * @returns {any} 找到则返回数组 未找到则返回空数组
 */
async function getSet(key: string): Promise<string[]> {
  try {
    const result = await redisClient.smembers(key)
    return result
  } catch (error) {
    throw error
  }
}

/**
 * 检查指定集合中是否存在某个值
 * @author Peng
 * @date 2023-03-08
 * @param {any} key:string
 * @param {any} member:string|number
 * @returns {boolean} 存在true 不存在false
 */
async function checkSetHasValue(
  key: string,
  member: string | number
): Promise<boolean> {
  try {
    return !!(await redisClient.sismember(key, member))
  } catch (error) {
    throw error
  }
}

/**
 * 批量删除 指定集合中的key
 * @author Peng
 * @date 2023-03-08
 * @param {any} key:string
 * @param {any} ...values:Array<T>
 * @returns {any}
 */
async function removeSetValues<T extends string | number>(
  key: string,
  ...values: Array<T>
): Promise<number> {
  try {
    return await redisClient.srem(
      key,
      ...(values as Array<string | number | Buffer>)
    )
  } catch (error) {
    throw error
  }
}

/**
 * 往指定有序集合中添加数据 集合不存在时自动创建
 * @author Peng
 * @date 2023-03-20
 * @returns {any}
 */
async function addToSortSet(
  key: string,
  value: string,
  score: number
): Promise<boolean> {
  try {
    const addRes = await redisClient.zadd(key, score, value)
    return !!addRes
  } catch (error) {
    throw error
  }
}

/**
 * 获取有序集合数据
 * @author Peng
 * @date 2023-03-27
 * @param {any} key:string
 * @param {any} sort?:'ASC'|'DESC'
 * @param {any} isWithScores?:Boolean
 * @param {any} start?:number
 * @param {any} end?:number
 * @returns {Array<string>}
 */
async function getSortSet(
  key: string,
  sort?: 'ASC' | 'DESC',
  isWithScores?: Boolean,
  start?: number,
  end?: number
): Promise<string[]> {
  try {
    if (sort === 'ASC' || !sort) {
      if (isWithScores)
        return await redisClient.zrange(
          key,
          start || 0,
          end || -1,
          'WITHSCORES'
        )
      return await redisClient.zrange(key, start || 0, end || -1)
    } else {
      if (isWithScores)
        return await redisClient.zrevrange(
          key,
          start || 0,
          end || -1,
          'WITHSCORES'
        )
      return await redisClient.zrevrange(key, start || 0, end || -1)
    }
  } catch (error) {
    throw error
  }
}

/**
 * 删除单个或多个 有序集合中的数据
 * @author Peng
 * @date 2023-03-27
 * @param {any} sKey:string
 * @param {any} delVal:string|string[]
 * @returns {Boolean}
 */
async function removeSortSetValues(
  sKey: string,
  delVal: string | string[]
): Promise<Boolean> {
  try {
    if (typeof delVal === 'string')
      return !!(await redisClient.zrem(sKey, delVal))
    return !!(await redisClient.zrem(sKey, ...delVal))
  } catch (e) {
    throw e
  }
}

/**
 * 判断有序集合中是否存在指定值
 * @author Peng
 * @date 2023-03-27
 * @param {any} key:string
 * @param {any} member:string|number
 * @returns {Boolean}
 */
async function checkSortSetHasValue(
  key: string,
  member: string | number
): Promise<Boolean> {
  try {
    return !!(await redisClient.zscore(key, member))
  } catch (e) {
    throw e
  }
}

/**
 * 设置指定Hash表数据 没有则自动创建
 * @author Peng
 * @date 2023-03-10
 * @param {any} key:string
 * @param {string} hKey:string
 * @param { object | number | string} data:object
 * @param {number} second?:object
 * @returns {number} 返回存储成功的 键值对数量 当更新一个已经存在的 键时 返回为0
 */
async function setHashCatch(
  key: string,
  hKey: string,
  data: object | number | string,
  second?: number extends 0 ? never : number
): Promise<number> {
  try {
    if (typeof data === 'object') data = JSON.stringify(data)
    const setRes = await redisClient.hset(key, hKey, data)
    // 当传入过期时间时 设置指定hash的过期时间
    if (second !== undefined) redisClient.expire(key, second)
    return setRes
  } catch (error) {
    throw error
  }
}

/**
 * 获取指定Hash表中指定key的数据 key不存在则返回null
 * @author Peng
 * @date 2023-03-10
 * @param {any} key:string
 * @param {any} hKey:string 表中的key
 * @returns {string | null} 字符串结果 或者 null
 */
async function getKeyHash(
  key: string,
  hKey: string
): Promise<string | number | null | object | []> {
  try {
    const res = await redisClient.hget(key, hKey)
    // 判断存储的是否是数字类型
    if (Number(res)) return Number(res)
    // 判断 回来的数据是否 JSON 数据
    if (JSON_REGEX.test(res)) return JSON.parse(res)
    // 返回字符串
    return res
  } catch (error) {
    throw error
  }
}

/**
 * 获取指定Hash表全部数据
 * @author Peng
 * @date 2023-03-10
 * @param {any} key:string
 * @returns {object} 查询结果对象 无则返回空{}
 */
async function getAllHash(key: string): Promise<object> {
  try {
    return await redisClient.hgetall(key)
  } catch (error) {
    throw error
  }
}

/**
 * 删除单个或多个 hash中的数据 单个键或者键数组
 * @author Peng
 * @date 2023-03-25
 * @param {any} key:string
 * @param {any} hKey:string|string[]
 * @returns {any}
 */
async function delKeyInHash(
  key: string,
  hKey: string | string[]
): Promise<number> {
  try {
    if (typeof hKey === 'string') return await redisClient.hdel(key, hKey)
    return await redisClient.hdel(key, ...hKey)
  } catch (e) {
    throw e
  }
}

/**
 * 测试
 * @author Peng
 * @date 2023-02-23
 * @returns {void}
 */
async function test(): Promise<void> {
  // for (let i = 0; i <= 10; i++) {
  //   setTimeout(async () => {
  //     console.log('i -----', i)
  //     // await setHashCatch('testHash', `key${Date.now()}`, Date.now())
  //     const setRes = await addToSortSet(
  //       'testSSet',
  //       `hhhh${Date.now()}`,
  //       Date.now()
  //     )
  //   }, i * 100)
  // }
  // const delRes = await delKeyInHash('testHash', [
  //   'key1679809623132',
  //   'key1679809623024',
  //   'key1679809622931',
  // ])
  // console.log('delRes -----', delRes)
  // const setRes = await setHashCatch('testHash', 'testArr', [
  //   1,
  //   2,
  //   3,
  //   4,
  //   { name: 'zs' },
  // ])
  // console.log('setRes -----', setRes)

  // const res = await getKeyHash('testHash', '121')
  // const res = await getKeyHash('testHash', 'desc')
  // const res = await getKeyHash('testHash', 'testArr')
  // const res = await getAllHash('testHash')
  // // await delKeyInHash()
  // console.log('hash查询结果 res -----', res)

  // const setRes = await addToSortSet('testSSet', 'hhhh', Date.now())
  // console.log('setRes -----', setRes)
  // const findRes = await redisClient.zrange('testSSet', 0, -1, 'WITHSCORES')
  const findRes = await getSortSet('testSSet', 'DESC', true)
  console.log('findRes -----', findRes)

  const isCheck = await checkSortSetHasValue('testSSet', 'hhhhh')
  console.log('isCheck -----', isCheck)
  // const setHashResult = await redisClient.hset('testObj', {
  //   name: 'zs',
  //   age: '14',
  // })
  // console.log('setHashResult -----', setHashResult)

  // const getHashRes = await redisClient.hgetall('testObj1')
  // console.log('getHashRes -----', getHashRes)
  // redisClient
  //   .hget('testObj', 'name1')
  //   .then((res) => console.log('res -----', res))
  // console.log('redisClient -----', redisClient)
  // const status = await setCache('test', { name: '张三' }, 100)
  // // const status = await setCaches({ key4: '哈', key5: '哈哈', key6: '哈哈哈' }, 100)
  // console.log('设置缓存 -----', status) // OK

  // const res = await getCache('testSet')
  // console.log('获取缓存 -----', JSON.parse(res as any)) // 成功 value 失败 null

  // const delStatus = await delCache('test1') // 删除 成功1 失败0
  // console.log('删除缓存 -----', delStatus)

  // const isExist = await isExists('key5') // 存在true 不存在false
  // console.log('isExist -----', isExist)

  // const result = await incrCounter('testCounter', 1000)
  // console.log('result -----', result)

  // const conterRes = await getCache('testCounter')
  // console.log('计数器结果 -----', conterRes)
  // const testCounter = await getCache('testCounter')
  // console.log('testCounter -----', testCounter)

  // const addStatus = await addToSet<number | string>(
  //   'testSet',
  //   JSON.stringify({ name: 'zs', age: 18 })
  // )
  // console.log('集合添加状态 -----', addStatus)

  // const setHasThisValue = await checkSetHasValue(
  //   'testSet',
  //   JSON.stringify({ name: 'zs', age: 18 })
  // )
  // console.log('集合中是否包含当前值? -----', setHasThisValue)

  // const delCount = await removeSetValues('testSet', 3, 4)
  // console.log('删除集合数 -----', delCount)

  // const setVal = await getSet('testSet')
  // console.log('测试集合 -----', setVal)
  // console.log('是否是集群 -----', redisClient.isCluster)

  redisClient.quit()
}
// test()

export {
  redisClient,
  setCache,
  getCache,
  delCache,
  isExists,
  incrCounter,
  addToSet,
  getSet,
  checkSetHasValue,
  removeSetValues,
  addToSortSet,
  getSortSet,
  removeSortSetValues,
  checkSortSetHasValue,
  setHashCatch,
  getKeyHash,
  getAllHash,
  delKeyInHash,
}
