import { Request, Response, NextFunction } from 'express'
import TagService from '../services/tagService'
import { validateOrRejectDTO } from '../helpers/validateParams'
import { GetTagListDTO, AddTagDTO, UpdateTagDTO } from '../dtos/tagDTO'
import MyError from '../helpers/exceptionError'
import { PARAMS_ERROR_CODE } from '../helpers/errorCode'

class TagController {
  private tagService = new TagService()
  /**
   * 获取文章标签列表
   * @author Peng
   * @date 2023-04-25
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public getTagList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(GetTagListDTO, req.query)
      const { data, total } = await this.tagService.findTagList(
        req.query as any
      )
      res.send({
        code: 200,
        message: 'Success',
        data,
        total,
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 添加tag
   * @author Peng
   * @date 2023-04-25
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public addNewTag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(AddTagDTO, req.body)
      // 添加标签
      const addRes = await this.tagService.createdTag(req.body)
      res.send({
        code: 200,
        message: addRes ? 'Success' : 'Failed',
        data: addRes ? '添加成功!' : '添加失败, 当前标签已存在!',
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 通过ID更新标签信息
   * @author Peng
   * @date 2023-04-25
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public updateTag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const id: number | boolean = parseInt(req.params.id) || false
      if (!id || id <= 0)
        throw new MyError(
          PARAMS_ERROR_CODE,
          'params error!',
          '标签id参数有误!',
          'DTO'
        )
      await validateOrRejectDTO(UpdateTagDTO, req.body)

      const isFind = await this.tagService.findTagById(id)
      if (!isFind)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '更新失败, 未找到标签相关信息!',
        })

      const editResNum = await this.tagService.editTagById(id, req.body)
      const msgHashMapping = {
        0: '更新失败, 更新内容与之前一致!',
        1: '更新成功!',
        2: '更新失败, 已存在该标签, 请确保标签唯一性!',
      }
      res.send({
        code: 200,
        message: editResNum === 1 ? 'Success' : 'Failed',
        data: msgHashMapping[editResNum],
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 通过ID删除标签信息
   * @author Peng
   * @date 2023-04-25
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public delTag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const id: number | boolean = parseInt(req.params.id) || false
      if (!id || id <= 0)
        throw new MyError(
          PARAMS_ERROR_CODE,
          'params error!',
          '标签id参数有误!',
          'DTO'
        )
      const isFind = await this.tagService.findTagById(id)
      if (!isFind)
        return res.send({
          code: 200,
          message: 'Failed',
          data: '删除失败, 未找到标签相关信息!',
        })

      const delRes = await this.tagService.deleteTagById(id)
      res.send({
        code: 200,
        message: delRes ? 'Success' : 'Failed',
        data: delRes ? '删除成功' : '删除失败, 未找到标签相关信息!',
      })
    } catch (e) {
      next(e)
    }
  }
}

export default TagController
