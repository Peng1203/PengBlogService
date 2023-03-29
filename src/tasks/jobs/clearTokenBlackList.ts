import { getSortSet, removeSortSetValues } from '../../db/redis'
import { EXPIRESD } from '../../configs/sign'
/**
 * 清除黑名单token 执行时间 每天12点执行
 * @author Peng
 * @date 2023-03-29
 * @returns {any}
 */
const cronTime: string = '0 0 0 * * *'
// const cronTime: string = '*/10 * * * * *'

async function clearTokenBlackList(): Promise<void> {
  try {
    const blackList = await getSortSet('tokenBlackList', 'ASC', true)
    // console.log('清除黑名单token的定时任务 执行啦 -----blackList', blackList)
    const tokenList: string[] = []
    const score: number[] = []
    blackList.forEach((item: string, i: number) => {
      if (i % 2 === 0) tokenList.push(item)
      else score.push(Number(item))
    })
    // 当时时间戳
    const nowTimeStamp = Date.now()
    // token有效的毫秒
    const tokenValidMs = EXPIRESD * 1000
    // 获取已过期 token 的索引
    const delIndex: Array<number> = []
    score.forEach((renderMs: number, i: number) => {
      // 过期毫秒数
      const expMs = renderMs + tokenValidMs
      if (expMs < nowTimeStamp) delIndex.push(i)
    })
    // 当没有需要删除的数据时 不进行删除集合中数据操作
    if (!delIndex.length) return
    const delTokenList: string[] = delIndex.map(delI => tokenList[delI])
    // 删除已过期的token
    await removeSortSetValues('tokenBlackList', delTokenList)
  } catch (e) {
    console.log('清除token黑名单定时任务报错 -----', e)
  }
}
export default {
  cronTime,
  clearTokenBlackList,
}
