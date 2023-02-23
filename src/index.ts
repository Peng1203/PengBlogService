const server = require('./server')

const port: string = process.env.PORT || '3000'

server.listen(port, () => console.log(`server in running http://127.0.0.1:${port}`))