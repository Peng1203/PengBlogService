import TaskManager from './taskManager'
import tokenBlackList from './jobs/clearTokenBlackList'

const taskManager = new TaskManager()

// 添加定时清除黑名单token任务
taskManager.addTask(
  tokenBlackList.cronTime,
  tokenBlackList.clearTokenBlackList,
  true
)

export default taskManager
