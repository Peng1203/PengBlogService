import dotenv from 'dotenv'
import server from './server'

const { API_URL, PORT } = dotenv.config().parsed

server.listen(PORT, () => console.log(`service is running: ${API_URL}:${PORT}`))
