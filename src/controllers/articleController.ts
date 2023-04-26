import { Request, Response, NextFunction } from 'express'
import ArticleService from '../services/articleService'
import { validateOrRejectDTO } from '../helpers/validateParams'
import {
  GetArticleListDTO,
  AddArticleDTO,
  UpdateArticleDTO,
} from '../dtos/articleDTO'
import MyError from '../helpers/exceptionError'
import { PARAMS_ERROR_CODE } from '../helpers/errorCode'

class ArticleController {
  private articleService = new ArticleService()
  /**
   * 获取文章列表
   * @author Peng
   * @date 2023-04-26
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public getArticleList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(GetArticleListDTO, req.query)
      const { data, total } = await this.articleService.findArticleList(
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
   * 添加文章
   * @author Peng
   * @date 2023-04-26
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public addNewArticle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(AddArticleDTO, req.body)
      // 添加文章
      const addRes = await this.articleService.createdArticle(req.body)
      res.send({
        code: 200,
        message: addRes ? 'Success' : 'Failed',
        data: addRes ? '添加成功!' : '添加失败, 当前文章已存在!',
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 通过ID更新文章信息
   * @author Peng
   * @date 2023-04-26
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public updateArticle = async (
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
          '文章id参数有误!',
          'DTO'
        )

      const isFind = await this.articleService.findArticleById(id)
      if (!isFind)
        return res.send({
          code: 200,
          data: 'Failed',
          message: '更新失败, 未找到文章相关信息!',
        })

      await validateOrRejectDTO(UpdateArticleDTO, req.body)

      const editResNum = await this.articleService.editArticleById(id, req.body)
      const msgHashMapping = {
        0: '更新失败, 更新内容与之前一致!',
        1: '更新成功!',
        2: '更新失败, 已存在该文章, 请确保文章唯一性!',
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
   * 通过ID删除文章信息
   * @author Peng
   * @date 2023-04-26
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public delArticle = async (
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
          '文章id参数有误!',
          'DTO'
        )
      const isFind = await this.articleService.findArticleById(id)
      if (!isFind)
        return res.send({
          code: 200,
          data: 'Failed',
          message: '删除失败, 未找到文章相关信息!',
        })

      const delRes = await this.articleService.deleteArticleById(id)
      res.send({
        code: 200,
        data: delRes ? 'Success' : 'Failed',
        message: delRes ? '删除成功' : '删除失败, 未找到文章相关信息!',
      })
    } catch (e) {
      next(e)
    }
  }
}

export default ArticleController
