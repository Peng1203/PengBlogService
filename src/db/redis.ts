import redis from 'ioredis'
import config from '../configs/redisConfig'
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
async function getCache<T>(key: string): Promise<T | null> {
  try {
    const result = await redisClient.get(key)
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
async function incrCounter<T extends number | Error>(
  counterKey: string
): Promise<T> {
  try {
    return (await redisClient.incr(counterKey)) as T
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
async function addToSSet(key: string, score: number, value: string): Promise<boolean> {
  try {
    const addRes = await redisClient.zadd(key, score, value)
    console.log('addRes -----', addRes)
    return !!(addRes)
  } catch (error) {
    throw error
  }
}

/**
 * 设置指定Hash表数据 没有则自动创建
 * @author Peng
 * @date 2023-03-10
 * @param {any} key:string
 * @param {any} data:object
 * @returns {number} 返回存储成功的 键值对 数量
 */
async function setHashCatch(key: string, data: object): Promise<number> {
  try {
    return await redisClient.hset(key, data)
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
async function getKeyHash(key: string, hKey: string): Promise<string | null> {
  try {
    return await redisClient.hget(key, hKey)
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
 * 测试
 * @author Peng
 * @date 2023-02-23
 * @returns {void}
 */
async function test() {
  // await addToSSet('testSSet', Date.now(), '123')


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

  // const result = await incrCounter('testCounter')
  // console.log('result -----', result)

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
  setHashCatch,
  getKeyHash,
  getAllHash,
}
