// 角色列表包含属性
export interface RoleListItemInfo {
  id: string
  roleName: string
  roleDesc: string
  menus: any[]
  operationPermissions: []
  createdTime: string
  updateTime: string
}
