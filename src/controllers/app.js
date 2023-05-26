const path = require('path')
const { execFile } = require('child_process');

const scriptPath = path.join(
  __dirname,
  '../',
  '/script/updateAdmin/index.bat'
)

console.log('scriptPath -----', scriptPath)

const child = execFile(scriptPath)

child.on('close', (res) => {
  console.log('close -----', res)
})
child.on('error', (res) => {
  console.log('error -----', res)
})
child.on('exit', (res) => {
  console.log('exit -----', res)
})
child.on('message', (res) => {
  console.log('message -----', res)
})
child.on('spawn', (res) => {
  console.log('spawn -----', res)
})