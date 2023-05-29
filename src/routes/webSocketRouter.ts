import express, { Application, Request } from 'express'
import expressWs, { WebSocket } from 'express-ws'
import WebSocketController from '../controllers/wsController'

const app: Application = express()

const router: any = express.Router()
expressWs(router)

expressWs(app, null, {
  wsOptions: { perMessageDeflate: false },
  wsHeartbeatInterval: 5000,
})

const wsController = new WebSocketController()

router.ws('/', (ws: WebSocket, req: Request) => {
  console.log('有客户端连接', ws)

  ws.send('你好 这里是服务端')

  ws.on('message', message => {
    console.log('收到客户端消息:', message)

    // 发送消息给客户端
    ws.send('Hello from server!')
  })

  ws.on('close', () => {
    console.log('客户端断开连接')
  })
})

router.ws('/updata-system', wsController.upgradSystem)

export default router
