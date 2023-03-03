const dotenv = require('dotenv').config();
const server = require('./server')

const port: string = process.env.PORT || '3000'
const { API_URL, PORT } = dotenv.parsed

server.listen(port, () => console.log(`${API_URL}:${PORT}`))