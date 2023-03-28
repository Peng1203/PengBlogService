import schedule, { Job } from 'node-schedule'

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

  start(): void {
    this.tasks.forEach(task => task.schedule())
  }

  addTask(cronTime: string, taskFn: () => void): Job {
    const task = schedule.scheduleJob(cronTime, taskFn)
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
