// 用户列表信息
export interface UserListItemInfo {
  id: number
  roleId: number
  userName: string
  email: string
  state: number
  createdTime: string
  updateTime: string
  unsealTime: string | null
}
