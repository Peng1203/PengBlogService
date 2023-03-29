import schedule from 'node-schedule'
console.log('schedule -----', schedule)

/**
 * 开启定时任务
 * @author Peng
 * @date 2023-03-28
 * @param {any} '******'
 * @param {any} async(
 * @returns {any}
 */
/**
 * 定时任务 参数
 * 可接收6个 * 号
 * 6个 * 号依次对应
 * // * * * * * * *
 * // 秒(0 ~ 59)
 * // 分(0 ~ 59)
 * // 时(0 ~ 23)
 * // 日(1 ~ 31)
 * // 月(1 ~ 12)
 * // 天(周几 0 ~ 7) 1 ~ 6表示周1到周6 0和7都表示周日
 *
 */
// * * * * * *
// 5 * * * * * 表示在每分钟的第5秒执行
// */5 星号表示匹配任意秒数，而斜杠 / 表示匹配指定步长的秒数 表示每5秒会执行一次
const task = schedule.scheduleJob(
  '*/3 * * * * *',
  () => {
    console.log('定时任务执行啦 -----')
  },
  {
    scheduled: false,
  }
)

// setTimeout(() => {
//   console.log('task -----', task)
//   console.log('定时任务取消了 -----')
//   task.cancel()
// }, 10000)
