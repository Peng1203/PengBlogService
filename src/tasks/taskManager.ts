import schedule, { Job } from 'node-schedule'

/**
 * scheduleJob 定时任务 参数1指定执行日期 参数2 执行函数
 * 可接收6个 * 号 或者 一个 Date 对象
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

/**
 * 创建定时任务管理类
 * @author Peng
 * @date 2023-03-28
 * @method addTask 添加定时任务
 * @method removeTask 删除定时任务
 * @method clearAllTasks 清除全部任务
 * @returns {any}
 */
class TaskManager {
  // 任务实例
  tasks: Job[]
  constructor() {
    this.tasks = []
  }

  startTasks(): void {
    this.tasks.forEach(task => task.schedule())
  }

  addTask(cronTime: string, taskFn: () => void, isImmediate?: boolean): Job {
    const task = schedule.scheduleJob(cronTime, taskFn)
    // 任务 立即执行一次
    if (isImmediate) task.invoke()
    this.tasks.push(task)
    return task
  }

  removeTask(task: Job): void {
    const index = this.tasks.indexOf(task)
    if (index !== -1) {
      this.tasks.splice(index, 1)
      task.cancel()
    }
  }

  clearAllTasks(): void {
    this.tasks.forEach(task => task.cancel())
    this.tasks = []
  }
}

export default TaskManager
