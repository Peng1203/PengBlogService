// UUID参数格式 正则校验
export const UUID_REGEX =
  /^[a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}$/
// 判断字符串是否是JSON格式字符串
export const JSON_REGEX = /^\s*(\{[\w\W]*\}|\[[\w\W]*\])\s*$/

// 日期格式
export const DATE_TIME_REGEX =
  /^(19|20)\d{2}-(0[1-9]|1[0-2])-([0-2][1-9]|3[0-1]) ([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/

// 匹配以 / 开头的路由地址
export const PATH_REGEX = /^\/.*/g
