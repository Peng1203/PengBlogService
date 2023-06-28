import {
  readdir,
  readdirSync,
  existsSync,
  lstatSync,
  unlinkSync,
  rmdirSync,
  statSync,
} from 'fs'

import { join } from 'path'
import { dateTimeFormat } from '../utils/moment'

// 递归删除目录以及子目录
export function deleteFolderRecursive(path): boolean {
  try {
    if (existsSync(path)) {
      readdirSync(path).forEach(file => {
        const curPath = `${path}/${file}`

        if (lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath) // 递归删除子目录
        } else {
          unlinkSync(curPath) // 删除文件
        }
      })

      rmdirSync(path) // 删除空目录
      return true
    } else return false
  } catch (e) {
    return false
  }
}

// 判断是否存储指定目录
export function isDirectoryExists(directoryPath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    readdir(directoryPath, err => {
      if (err) {
        if (err.code === 'ENOENT') resolve(false)
        else reject(err)
      } else resolve(true)
    })
  })
}

// 获取指定目录的详细信息 并处理返回结果
export function getDirectoryDetail(directoryPath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    readdir(directoryPath, (err, files) => {
      if (err) reject([])
      else {
        const data = files.map(item => {
          const accessPath = join(directoryPath, item)
          const stats = statSync(accessPath)
          const { size, mtimeMs, birthtimeMs } = stats

          // 文件
          if (stats.isFile()) {
            const splitRes = item.split('.')
            return {
              name: item,
              type: splitRes[splitRes.length - 1],
              size: size
                ? `${(size / 1024 / 1024).toFixed(2)} MB`
                : `${size} MB`,
              byte: size,
              fullPath: accessPath,
              createdTime: dateTimeFormat(birthtimeMs),
              lastModified: dateTimeFormat(mtimeMs),
            }
          } else if (stats.isDirectory()) {
            // 目录
            return {
              name: item,
              type: 'dir',
              fullPath: accessPath,
            }
          }
        })
        resolve(data)
      }
    })
  })
}
