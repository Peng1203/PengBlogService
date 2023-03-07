const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv').config();

module.exports = {
  entry: './src/index.ts', // 项目入口文件
  target: 'node', // 指定打包后的代码是在 node 环境下运行
  externals: [nodeExternals()], // 只打包用到的文件 
  module: {
    rules: [
      {
        test: /\.ts$/, // 匹配以 .ts 结尾的文件
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'], // 配置可以省略的文件后缀名
    alias: {
      '@': path.resolve(__dirname, './src') // 配置路径别名
    }
  },
  mode: process.env.NODE_ENV,
  output: {
    filename: 'app.js', // 打包后生成的文件名
    path: path.resolve(__dirname, dotenv.parsed.OUT_PUT_NAME), // 打包后的文件存放目录
    // publicPath: path.resolve(__dirname, 'public')
  },
  // 分割打包文件
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    // minimize: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/public', // 要复制的目录或文件
          to: './public' // 复制到打包后的目录
        }
      ]
    })
  ]
};
