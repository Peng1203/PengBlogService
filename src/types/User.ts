export type loginInfoType = {
  userName: string
  password: string
}

export type setTokenType = {
  userId: number | string
  userName: string
  token: string
}

// 添加用户信息
export type addUserInfoType = {
  userName: string
  password: string
  roleId: number
  email?: string
  state?: number
}
