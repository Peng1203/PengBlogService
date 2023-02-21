/** 
 * 根据开发环境显示不同的网关
 */

let URL = ''
console.log('process.env.NODE_ENV -----', process.env.NODE_ENV)
switch (process.env.NODE_ENV) {
  case 'development':
    URL = 'http://127.0.0.1'
    break;
  case 'production':
    // 线上服务器公网IP地址 或域名
    URL = 'http://1.1.1.1'
    break;
  default:
    URL = 'http://localhost'
    break;
}

module.exports = URL