import { readdir, mkdir, stat, statSync, rmdir, unlink, existsSync } from 'fs'
import { join } from 'path'
import { ExpressHandler } from '../types/global'
import { STATIC_RESOURCE_ROOT_PATH } from '../configs/sign'
import { dateTimeFormat } from '../utils/moment'
import { validateOrRejectDTO } from '../helpers/validateParams'
import { GetDirectoryDTO, RemoveFileOrDirDTO } from '../dtos/resourceDTO'
import {
  deleteFolderRecursive,
  isDirectoryExists,
  getDirectoryDetail,
} from '../utils/fileHandler'

class ResourceController {
  /**
   * 获取指定目录
   * @author Peng
   * @date 2023-06-28
   * @param {any} req
   * @param {any} res
   * @param {any} next
   * @returns {any}
   */
  public getDirectory: ExpressHandler = async (
    req,
    res,
    next
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(GetDirectoryDTO, req.query)
      const { path } = req.query
      const fullPath = path as string
      const isHave = await isDirectoryExists(fullPath)
      if (!isHave)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '未找到指定文件夹!',
        })

      const data = await getDirectoryDetail(fullPath)

      res.send({
        code: 200,
        message: 'Success',
        data,
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 获取相册目录
   * @author Peng
   * @date 2023-06-28
   * @param {any} req
   * @param {any} res
   * @param {any} next
   * @returns {any}
   */
  public getAlbumCatalog: ExpressHandler = async (
    req,
    res,
    next
  ): Promise<any> => {
    let albumsFiles: string[] = []
    const dirPath = join(STATIC_RESOURCE_ROOT_PATH, '/albums')
    readdir(dirPath, async (error, files) => {
      try {
        if (error) {
          // 当目录不存在时 则进行创建
          mkdir(dirPath, { recursive: true } as any, err => {
            if (err) res.send('目录创建失败!')
            else console.log('目录创建成功')
          })
        } else albumsFiles = files
        // 处理文件数据
        const formatFiles = albumsFiles.map(item => {
          const accessPath = join(dirPath, item)
          const stats = statSync(accessPath)
          const { size, mtimeMs, birthtimeMs } = stats

          // console.log('detailInfo -----', detailInfo)
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
              path: join('/albums', item),
              fullPath: accessPath,
              createdTime: dateTimeFormat(birthtimeMs),
              lastModified: dateTimeFormat(mtimeMs),
            }
          } else if (stats.isDirectory()) {
            // 目录
            return {
              name: item,
              type: 'dir',
              path: join('/albums', item),
              fullPath: accessPath,
            }
          }
        })

        res.send(formatFiles)
      } catch (e) {
        next(e)
      }
    })
  }

  /**
   * 删除文件夹或者
   * @author Peng
   * @date 2023-06-28
   * @param {any} req
   * @param {any} res
   * @param {any} next
   * @returns {any}
   */
  public removeFileOrDir: ExpressHandler = async (
    req,
    res,
    next
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(RemoveFileOrDirDTO, req.body)

      const { type, path } = req.body
      if (type === 'dir') {
        stat(path, err => {
          if (!err) {
            const remRes = deleteFolderRecursive(path)
            res.send({
              code: 200,
              message: remRes ? 'Success' : 'Failed',
              data: remRes ? '文件夹删除成功!' : '文件夹删除失败!',
            })
          } else {
            res.send({
              code: 200,
              message: 'Failed',
              data: '未找到指定文件夹!',
            })
          }
        })
      } else if (type === 'file') {
        if (existsSync(path)) {
          unlink(path, err => {
            res.send({
              code: 200,
              message: !err ? 'Success' : 'Failed',
              data: !err ? '文件删除成功!' : '文件删除失败!',
            })
          })
        } else {
          res.send({
            code: 200,
            message: 'Failed',
            data: '未找到指定文件!',
          })
        }
      }
    } catch (e) {
      next(e)
    }
  }
}

export default ResourceController
