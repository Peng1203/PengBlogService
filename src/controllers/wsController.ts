import path from 'path'
import { spawn } from 'child_process'
import os from 'os'
import { Request } from 'express'
import { WebSocket } from 'express-ws'

/**
 * ws请求 处理控制器
 * @author Peng
 * @date 2023-05-26
 * @param {any} parameters
 * @returns {any}
 */
class WebSocketController {
  /**
   * 更新系统
   * @author Peng
   * @date 2023-05-29
   * @param {any} ws:WebSocket
   * @param {any} req:Request
   * @returns {any}
   */
  public upgradSystem = (ws: WebSocket, req: Request) => {
    ws.on('message', message => {
      const data = JSON.parse(message)
      // const data = JSON.parse(message)

      switch (data.type) {
        case 'webAdmin':
          this.upgradWebAdminSys(ws)
          break
        default:
          ws.send('参数有误')
          break
      }
    })
  }

  /**
   * 更新 admin web 系统
   * @author Peng
   * @date 2023-05-29
   * @returns {any}
   */
  upgradWebAdminSys(ws: WebSocket) {
    const scriptPath =
      os.platform() === 'linux'
        ? path.join(__dirname, '../', './script/updateAdmin/index.sh')
        : path.join(__dirname, '../', './script/updateAdmin/index.bat')

    console.log('scriptPath -----', scriptPath)

    const scriptJob = spawn(scriptPath)
    scriptJob.on('close', code => {
      console.log(`脚本执行完成，退出码: ${code}`)
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
  }
}

export default WebSocketController
