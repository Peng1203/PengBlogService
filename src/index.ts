const dotenv = require('dotenv').config()
const server = require('./server')

const { API_URL, PORT } = dotenv.parsed

server.listen(PORT, () => console.log(`service is running: ${API_URL}:${PORT}`))
