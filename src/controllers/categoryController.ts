import { Request, Response, NextFunction } from 'express'
import CategoryService from '../services/categoryService'
import { validateOrRejectDTO } from '../helpers/validateParams'
import {
  GetCategoryListDTO,
  AddCategoryDTO,
  UpdateCategoryDTO,
} from '../dtos/categoryDTO'
import MyError from '../helpers/exceptionError'
import { PARAMS_ERROR_CODE } from '../helpers/errorCode'

class CategoryController {
  private categoryService = new CategoryService()
  /**
   * 获取文章分类列表
   * @author Peng
   * @date 2023-04-26
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public getCategoryList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(GetCategoryListDTO, req.query)
      const { data, total } = await this.categoryService.findCategoryList(
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
   * 添加分类
   * @author Peng
   * @date 2023-04-26
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public addNewCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await validateOrRejectDTO(AddCategoryDTO, req.body)
      // 添加分类
      const addRes = await this.categoryService.createdCategory(req.body)
      res.send({
        code: 200,
        message: addRes ? 'Success' : 'Failed',
        data: addRes ? '添加成功!' : '添加失败, 当前分类已存在!',
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * 通过ID更新分类信息
   * @author Peng
   * @date 2023-04-26
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public updateCategory = async (
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
          '分类id参数有误!',
          'DTO'
        )

      const isFind = await this.categoryService.findCategoryById(id)
      if (!isFind)
        return res.send({
          code: 200,
          data: 'Failed',
          message: '更新失败, 未找到分类相关信息!',
        })

      await validateOrRejectDTO(UpdateCategoryDTO, req.body)

      const editResNum = await this.categoryService.editCategoryById(
        id,
        req.body
      )
      const msgHashMapping = {
        0: '更新失败, 更新内容与之前一致!',
        1: '更新成功!',
        2: '更新失败, 已存在该分类, 请确保分类唯一性!',
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
   * 通过ID删除分类信息
   * @author Peng
   * @date 2023-04-26
   * @param {any} req:Request
   * @param {any} res:Response
   * @param {any} next:NextFunction
   * @returns {any}
   */
  public delCategory = async (
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
          '分类id参数有误!',
          'DTO'
        )
      const isFind = await this.categoryService.findCategoryById(id)
      if (!isFind)
        return res.send({
          code: 200,
          data: 'Failed',
          message: '删除失败, 未找到分类相关信息!',
        })

      const delRes = await this.categoryService.deleteCategoryById(id)
      res.send({
        code: 200,
        data: delRes ? 'Success' : 'Failed',
        message: delRes ? '删除成功' : '删除失败, 未找到分类相关信息!',
      })
    } catch (e) {
      next(e)
    }
  }
}

export default CategoryController
