export default {
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: process.env.NODE_ENV === 'development' ? 'root' : '123mzp..',
  database: 'peng_blog_db',
}

// export default {
//   host: '116.204.120.144',
//   port: 3306,
//   username: 'root',
//   password: '123mzp..',
//   database: 'peng_blog_db',
// }
