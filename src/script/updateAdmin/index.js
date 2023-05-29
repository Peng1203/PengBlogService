const os = require('os')
const { exec } = require('child_process')
const { join } = require('path')

const scriptPath =
  os.platform() === 'linux'
    ? join(__dirname, './index.sh')
    : join(__dirname, './index.bat')
console.log('scriptPath -----', scriptPath)

const scriptJob = exec(scriptPath)
scriptJob.on('close', code => {
  console.log(`脚本执行完成，退出码: ${code}`)
  if (!code) process.send('Web-admin更新操作执行完成!')
})

scriptJob.on('exit', code => {
  console.log(`脚本退出，退出码: ${code}`)
})

scriptJob.on('error', error => {
  console.error(`脚本执行出错: ${error.message}`)
})

scriptJob.on('message', message => {
  console.log(`收到脚本消息: ${message}`)
})

scriptJob.on('disconnect', () => {
  console.log('与脚本的 IPC 连接断开')
})
