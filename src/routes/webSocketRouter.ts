import express, { Request } from 'express'
import expressWs from 'express-ws'

const router: any = express.Router()
expressWs(router)

router.ws('/', (ws, req: Request) => {
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

export default router
