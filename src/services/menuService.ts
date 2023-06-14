import _ from 'lodash'
import { Op } from 'sequelize'
import MenuModel from '../models/menuModel'
import { MenuListItemInfo } from '../interfaces/Menu'
import { ListResponse } from '../interfaces/Common'
import { ListParamsType } from '../types/Common'

/**
 * 定义service 菜单类
 */
class MenuService {
  /**
   * 查询菜单列表
   * @author Peng
   * @date 2023-04-06
   * @param {any} params:ListParamsType
   * @returns {any}
   */
  async findMenuList(params: ListParamsType): Promise<ListResponse> {
    try {
      const { page, pageSize, queryStr, column, order } = params
      const { rows, count: total } = await MenuModel.findAndCountAll({
        where: {
          [Op.or]: [
            { id: { [Op.like]: `%${queryStr}%` } },
            { menuName: { [Op.like]: `%${queryStr}%` } },
          ],
        },
        // offset: (page - 1) * pageSize,
        // limit: pageSize,
        order: [[column || 'id', order || 'ASC']],
      })
      // 获取全部的菜单唯一标识 用于前端过滤 已经添加过的菜单
      const allMenuURI: any[] = await MenuModel.findAll({
        attributes: ['menuURI'],
        raw: true,
      })

      // 已添加菜单的唯一标识
      const URIs = allMenuURI.map(item => item.menuURI)

      const data: MenuListItemInfo[] = rows.map(row => row.toJSON())
      return { data, total, URIs }
    } catch (e) {
      throw e
    }
  }

  /**
   * 处理菜单数据结构
   * @author Peng
   * @date 2023-06-11
   * @param {any} data:any[]
   * @returns {any}
   */
  handleMenuData(result: any[]): any[] {
    const data = JSON.parse(JSON.stringify(result))
    const newData: any = []
    // {
    //   "createdTime": "2023-06-11 22:19:39",
    //   "updateTime": "2023-06-11 23:34:18",
    //   "id": 1,
    //   "menuName": "权限管理",
    //   "menuPath": "/auth",
    //   "menuURI": "Auth",
    //   "menuIcon": "iconfont icon-auth",
    //   "parentId": 0,
    //   "menuType": "1",
    //   "menuRedirect": "SystemRole",
    //   "otherConfig": {
    //     "isHide": false,
    //     "isKeepAlive": false,
    //     "parentMenuName": ""
    //   }
    // }
    // ID哈希映射数据
    // const IDHashMapping = {}

    data.forEach(item => {
      ;(item.menuType === '1' || item.menuType === '2') && (item.children = [])
      item.otherConfig.parentMenuName === '' && newData.push(item)
    })

    function formatData(allData: any[], currentData: any[]) {
      allData.forEach((item: any) => {
        if (item.otherConfig.parentMenuName) {
          const findRes = currentData.find(
            menu => menu.menuURI === item.otherConfig.parentMenuName
          )
          if (findRes) {
            findRes?.children || (findRes.children = [])
            const existingChild = findRes.children.find(
              child => child.menuURI === item.menuURI
            )
            if (!existingChild) findRes.children.push(item)
          } else {
            currentData.forEach(
              menu => menu.children && formatData([item], menu.children)
            )
          }
        }
      })
    }

    formatData(data, newData)
    // console.log('newData -----', newData)
    // this.handleMenuData(data)
    return newData
  }

  async createdAllDefaultMenus(menuList: any[]): Promise<number> {
    try {
      const rows = await MenuModel.bulkCreate(menuList)
      return rows.length
    } catch (e) {
      throw e
    }
  }

  /**
   * 查询数据库并创建菜单
   * @author Peng
   * @date 2023-04-07
   * @param {any} menusInfo:any
   * @returns {any}
   */
  async createdMenu(menusInfo: any): Promise<boolean> {
    try {
      const { menuName, menuURI } = menusInfo
      const [result, isCreated] = await MenuModel.findOrCreate({
        where: {
          [Op.or]: [{ menuName }, { menuURI }],
        },
        defaults: menusInfo,
      })
      return isCreated
    } catch (e) {
      throw e
    }
  }

  /**
   * 根据ID查询菜单信息
   * @author Peng
   * @date 2023-04-08
   * @param {any} id:number
   * @returns {any}
   */
  async findMenuById(id: number): Promise<boolean> {
    try {
      return !!(await MenuModel.findByPk(id))
    } catch (e) {
      throw e
    }
  }

  /**
   * 通过ID删除菜单
   * @author Peng
   * @date 2023-04-08
   * @param {any} id:number
   * @returns {any}
   */
  async deleteMenuById(id: number): Promise<boolean> {
    try {
      return !!(await MenuModel.destroy({ where: { id } }))
    } catch (e) {
      throw e
    }
  }

  /**
   * 通过ID更新菜单信息
   * @author Peng
   * @date 2023-04-08
   * @param {any} id:number
   * @returns {any}
   */
  async updateMenuById(id: number, params: any): Promise<boolean> {
    try {
      const updateRes = await MenuModel.update(params, { where: { id } })
      return !!updateRes[0]
    } catch (e) {
      throw e
    }
  }
}

export default MenuService
